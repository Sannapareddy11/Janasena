const DeviceToken = require('../models/deviceTokenModel');
const { getMessaging } = require('../config/firebase');

const BATCH_SIZE = 500;

const getFrontendBaseUrl = () =>
  process.env.FRONTEND_URL || 'https://janasenanews.com';

const buildNewsNotification = (news) => {
  const baseUrl = getFrontendBaseUrl();
  const newsUrl = `${baseUrl}/news/${news.slug}`;

  return {
    notification: {
      title: 'New Article Published',
      body: news.title,
      ...(news.thumbnailImage ? { imageUrl: news.thumbnailImage } : {}),
    },
    data: {
      type: 'news',
      newsId: String(news._id),
      slug: news.slug,
      title: news.title,
      shortDescription: news.shortDescription || '',
      url: newsUrl,
      thumbnailImage: news.thumbnailImage || '',
    },
    webpush: {
      fcmOptions: {
        link: newsUrl,
      },
    },
  };
};

const sendToTokens = async (tokens, payload) => {
  if (!tokens.length) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  const messaging = getMessaging();
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);

    const response = await messaging.sendEachForMulticast({
      tokens: batch,
      ...payload,
    });

    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((result, index) => {
      if (result.success) {
        return;
      }

      const errorCode = result.error?.code;
      if (
        errorCode === 'messaging/invalid-registration-token' ||
        errorCode === 'messaging/registration-token-not-registered'
      ) {
        invalidTokens.push(batch[index]);
      }
    });
  }

  return { successCount, failureCount, invalidTokens };
};

const sendNewsPublishedNotification = async (news) => {
  try {
    const devices = await DeviceToken.find({ isActive: true }).select('fcmToken');
    const tokens = devices.map((device) => device.fcmToken);

    if (!tokens.length) {
      console.log('No active FCM tokens registered. Skipping push notification.');
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    const payload = buildNewsNotification(news);
    const result = await sendToTokens(tokens, payload);

    if (result.invalidTokens.length) {
      await DeviceToken.updateMany(
        { fcmToken: { $in: result.invalidTokens } },
        { isActive: false }
      );
    }

    console.log(
      `News push notification sent: ${result.successCount} success, ${result.failureCount} failed`
    );

    return result;
  } catch (error) {
    console.error('Failed to send news push notification:', error.message);
    return { successCount: 0, failureCount: 0, invalidTokens: [], error: error.message };
  }
};

module.exports = {
  sendNewsPublishedNotification,
};

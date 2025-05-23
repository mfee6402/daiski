import express from 'express';
import dotenv from 'dotenv';
import base64 from 'base-64';

dotenv.config();
const router = express.Router();

// 獲得token
const getAccessToken = async () => {
  try {
    const url = `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`;
    const auth = base64.encode(
      `${process.env.PAYPAL_CLIENTID}:${process.env.PAYPAL_SECRET}`
    );

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error('取得 access token 錯誤:', err);
  }
};

// 創建 PayPal 訂單
router.post('/', async function (req, res) {
  // 取得 PayPal access token

  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: [
              {
                name: 'APPLE',
                description: 'manyManyAPPLE',
                quantity: '1',
                unit_amount: {
                  currency_code: 'USD',
                  value: '87.00',
                },
              },
            ],
            amount: {
              currency_code: 'USD',
              value: '87.00',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '87.00',
                },
              },
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              payment_method_selected: 'PAYPAL',
              brand_name: 'Daiski',
              shipping_preference: 'NO_SHIPPING',
              locale: 'en-US',
              user_action: 'PAY_NOW',
              return_url: process.env.PAYPAL_REDIRECT_BASE_URL,
              cancel_url: process.env.PAYPAL_REDIRECT_BASE_URL,
            },
          },
        },
      }),
    });

    const data = await response.json();

    // console.log('PayPal 訂單回應:', data);
    const orderId = data.id;

    return res.status(200).json({ orderId });
  } catch (error) {
    console.error('創建訂單錯誤:', error);
    res.status(500).json({ error: '網路伺服器錯誤' });
  }
});

// 捕獲支付方式
router.get('/:paymentId', async function (req, res) {
  try {
    const accessToken = await getAccessToken();
    const { paymentId } = req.params;
    console.log(paymentId);
    const url = `${process.env.PAYPAL_BASEURL}/v2/checkout/orders/${paymentId}/capture`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'json',
    });
    const paymentData = await response.json();

    if (paymentData.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Paypal payment 失敗' });
    }

    const email = paymentData.payer.email_address;

    res.status(200).json({
      status: 'success',
      user: {
        email,
      },
    });
  } catch (error) {
    console.log('網路伺服器錯誤');
    res.status(500).json({ error: '網路伺服器錯誤' });
  }
});

export default router;

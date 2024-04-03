import nodemailer from "nodemailer";

const mail = async function (email, orderStatus, totalAmount, paymentStatus) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const message = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Burger Builder Order Status",
      html: `<p>Your order has been ${orderStatus}. Total Amount: <b>${totalAmount}</b>BDT. Your payment is ${paymentStatus} </p>`,
    };

    await transporter.sendMail(message);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default mail;

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail (you can change this to other providers)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    // Email content to send to you
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email where you want to receive messages
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">From:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff;">
              <strong>${name}</strong><br>
              <a href="mailto:${email}" style="color: #007bff;">${email}</a>
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
            <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to the sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff;">
            <h4 style="margin-top: 0; color: #555;">Your message:</h4>
            <div style="white-space: pre-wrap; color: #666;">
              ${message}
            </div>
          </div>
          
          <p>I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at <a href="mailto:athrian.pahang@gmail.com" style="color: #007bff;">athrian.pahang@gmail.com</a>.</p>
          
          <p>Best regards,<br>Athrian Pahang</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This is an automated response from my portfolio website.
            </p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

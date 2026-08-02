import nodemailer from "nodemailer"
import prisma from "./prisma/client"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${appUrl}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`

  const mailOptions = {
    from: `"InstantTool" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email - InstantTool",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to InstantTool!</h2>
        <p>Thank you for registering. To complete your signup and get your 20 free credits, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #052e16; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        <hr style="border: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function notifySuperAdminOnNewUser(newUserEmail: string, newUserName: string | null = null) {
  try {
    const superAdmins = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { id: true, email: true }
    })

    if (!superAdmins.length) return

    const adminEmails = superAdmins.map(admin => admin.email).filter(Boolean) as string[]
    
    // 1. Create In-App Notifications
    const notifications = superAdmins.map(admin => ({
      userId: admin.id,
      title: "New User Registered",
      message: `A new user ${newUserName ? `(${newUserName})` : ''} has signed up with email: ${newUserEmail}.`,
      type: "SYSTEM",
      isRead: false
    }))
    
    await prisma.notification.createMany({
      data: notifications
    })

    // 2. Send Emails
    if (adminEmails.length > 0) {
      const mailOptions = {
        from: `"InstantTool Admin" <${process.env.SMTP_USER}>`,
        to: adminEmails.join(", "),
        subject: "🎉 New User Registration - InstantTool",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
            <h2 style="color: #3b82f6;">New User Alert!</h2>
            <p>A new user has just registered on InstantTool.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${newUserEmail}</p>
              ${newUserName ? `<p style="margin: 0;"><strong>Name:</strong> ${newUserName}</p>` : ''}
            </div>
            <p style="color: #64748b; font-size: 14px;">Log in to the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" style="color: #3b82f6;">Admin Dashboard</a> to manage users.</p>
          </div>
        `
      }
      await transporter.sendMail(mailOptions)
    }
  } catch (err) {
    console.error("Failed to notify super admins of new user:", err)
  }
}

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Common email template function
function createEmailTemplate(order: any, config: {
  statusTitle: string;
  statusColor: string;
  statusBgColor: string;
  statusMessage: string;
  nextStepsTitle: string;
  nextStepsMessage: string;
  processingStep: number;
}) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="width: 65%;">
              <div style="font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 15px;">${item.title}</div>
              <div style="color: #6b7280; font-size: 14px;">
                Qty: ${item.quantity} × Rs. ${item.price}
                ${item.discount ? `<span style="color: #dc2626; font-weight: 500;"> (${item.discount}% discount)</span>` : ""}
              </div>
            </td>
            <td style="width: 35%; text-align: right; vertical-align: top;">
              <div style="font-weight: 600; color: #111827; font-size: 15px;">
                Rs. ${(item.quantity * item.price * (1 - (item.discount || 0) / 100)).toFixed(0)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `,
    )
    .join("")

  const lightLogo = "https://homage-publishers.vercel.app/images/homage-logo-01.png"

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Order Update</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; max-width: 100% !important; }
          .mobile-padding { padding: 20px !important; }
          .mobile-text { font-size: 14px !important; }
          .mobile-title { font-size: 24px !important; }
          .mobile-hide { display: none !important; }
          .mobile-stack { display: block !important; width: 100% !important; }
        }
        
        .dark-bg-text { color: #ffffff !important; }
        .light-bg-text { color: #111827 !important; }
        .muted-text { color: #6b7280 !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
      
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 20px;">
            
            <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #1f2937; padding: 32px 40px; text-align: center;" class="mobile-padding">
                  <img src="${lightLogo}" alt="Homage Publishers" style="max-width: 150px; height: auto; display: block; margin: 0 auto 16px auto; border: 0;" />
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;" class="mobile-title dark-bg-text">
                    HOMAGE PUBLISHERS
                  </h1>
                  <p style="margin: 8px 0 0 0; color: #d1d5db; font-size: 14px;" class="dark-bg-text">
                    Educational Excellence Delivered
                  </p>
                </td>
              </tr>
              
              <!-- Order Status -->
              <tr>
                <td style="padding: 32px 40px;" class="mobile-padding">
                  <div style="background-color: ${config.statusBgColor}; border-left: 4px solid ${config.statusColor}; padding: 20px; margin-bottom: 32px; border-radius: 4px;">
                    <h2 style="margin: 0 0 8px 0; color: ${config.statusColor}; font-size: 18px; font-weight: 600;">${config.statusTitle}</h2>
                    <p style="margin: 0; color: #374151; font-size: 15px;" class="light-bg-text">
                      Dear <strong>${order.shippingName}</strong>,<br>
                      ${config.statusMessage}
                    </p>
                  </div>
                  
                  <!-- Order Details -->
                  <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;" class="light-bg-text">
                    Order Details
                  </h3>
                  
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                    ${itemsHtml}
                  </table>
                  
                  <!-- Order Total -->
                  <div style="background-color: #1f2937; color: #ffffff; padding: 20px; text-align: center; border-radius: 4px; margin-bottom: 32px;">
                    <div style="font-size: 14px; margin-bottom: 4px; color: #d1d5db;" class="dark-bg-text">Order Total</div>
                    <div style="font-size: 28px; font-weight: 700; color: #ffffff;" class="dark-bg-text">Rs. ${order.total.toFixed(0)}</div>
                  </div>
                  
                  <!-- Shipping Information -->
                  <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;" class="light-bg-text">Shipping Address</h3>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
                    <div style="color: #374151; line-height: 1.6; font-size: 15px;" class="light-bg-text">
                      <strong>${order.shippingName}</strong><br>
                      ${order.shippingAddress}<br>
                      ${order.shippingCity}, ${order.shippingPostalCode}
                      ${order.shippingPhone ? `<br>Phone: ${order.shippingPhone}` : ""}
                    </div>
                  </div>
                  
                  <!-- Next Steps -->
                  <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 4px; margin-bottom: 32px;">
                    <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">${config.nextStepsTitle}</h3>
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      ${config.nextStepsMessage}
                    </p>
                  </div>
                  
                  <!-- Order Process -->
                  <div style="background-color: #f9fafb; padding: 24px; border-radius: 4px; border: 1px solid #e5e7eb;">
                    <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 16px; font-weight: 600; text-align: center;" class="light-bg-text">Order Process</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="33%" style="text-align: center; padding: 12px; vertical-align: top;" class="mobile-stack">
                          <div style="background-color: ${config.processingStep >= 1 ? '#16a34a' : '#6b7280'}; color: #ffffff; width: 32px; height: 32px; border-radius: 16px; margin: 0 auto 8px auto; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">1</div>
                          <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 4px;" class="light-bg-text">Processing</div>
                          <div style="color: #6b7280; font-size: 12px;" class="muted-text">Preparing your order</div>
                        </td>
                        <td width="33%" style="text-align: center; padding: 12px; vertical-align: top;" class="mobile-stack">
                          <div style="background-color: ${config.processingStep >= 2 ? '#16a34a' : '#6b7280'}; color: #ffffff; width: 32px; height: 32px; border-radius: 16px; margin: 0 auto 8px auto; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">2</div>
                          <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 4px;" class="light-bg-text">Shipping</div>
                          <div style="color: #6b7280; font-size: 12px;" class="muted-text">Out for delivery</div>
                        </td>
                        <td width="33%" style="text-align: center; padding: 12px; vertical-align: top;" class="mobile-stack">
                          <div style="background-color: ${config.processingStep >= 3 ? '#16a34a' : '#6b7280'}; color: #ffffff; width: 32px; height: 32px; border-radius: 16px; margin: 0 auto 8px auto; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">3</div>
                          <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 4px;" class="light-bg-text">Delivered</div>
                          <div style="color: #6b7280; font-size: 12px;" class="muted-text">At your doorstep</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1f2937; padding: 32px 40px; text-align: center;" class="mobile-padding">
                  <img src="${lightLogo}" alt="Homage Publishers" style="max-width: 120px; height: auto; display: block; margin: 0 auto 16px auto; border: 0;" />
                  
                  <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 600;" class="dark-bg-text">HOMAGE PUBLISHERS</h2>
                  <div style="width: 40px; height: 2px; background-color: #dc2626; margin: 0 auto 20px auto;"></div>
                  
                  <div style="color: #d1d5db; margin-bottom: 20px;" class="dark-bg-text">
                    <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;" class="dark-bg-text">Contact Information</h3>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 4px 8px; color: #9ca3af; font-size: 14px; text-align: right;" class="dark-bg-text">Email:</td>
                        <td style="padding: 4px 8px; color: #ffffff; font-size: 14px;" class="dark-bg-text">contact@homagepublishers.com</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 8px; color: #9ca3af; font-size: 14px; text-align: right;" class="dark-bg-text">Phone:</td>
                        <td style="padding: 4px 8px; color: #ffffff; font-size: 14px;" class="dark-bg-text">+92-21-3277-8692</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 8px; color: #9ca3af; font-size: 14px; text-align: right;" class="dark-bg-text">Website:</td>
                        <td style="padding: 4px 8px; color: #ffffff; font-size: 14px;" class="dark-bg-text">www.homagepublishers.com</td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="border-top: 1px solid #374151; padding-top: 16px;">
                    <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;" class="dark-bg-text">Thank you for choosing Homage Publishers</p>
                    <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px;" class="dark-bg-text">Your trusted partner in educational excellence</p>
                  </div>
                </td>
              </tr>
            </table>
            
            <div style="text-align: center; padding: 16px; color: #6b7280; font-size: 12px;">
              This email was sent to ${order.shippingEmail}
            </div>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Sends an order approval email to the user when their order is approved by the admin.
 */
export async function sendOrderConfirmationEmail(order: any) {
  if (!order.shippingEmail) {
    console.error("No shippingEmail found on order:", order)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured. Please add it to your .env file.")
    return
  }

  const html = createEmailTemplate(order, {
    statusTitle: "Order Approved",
    statusColor: "#16a34a",
    statusBgColor: "#f0fdf4",
    statusMessage: `Your order <strong>#${order.id.slice(-6)}</strong> has been approved and is being processed.`,
    nextStepsTitle: "What happens next?",
    nextStepsMessage: `Our team will contact you at <strong>${order.shippingPhone || order.shippingEmail}</strong> within 24 hours to confirm delivery details and arrange shipping.`,
    processingStep: 1
  })

  const text = `
HOMAGE PUBLISHERS
Educational Excellence Delivered

ORDER APPROVED

Dear ${order.shippingName},

Your order #${order.id.slice(-6)} has been approved and is being processed.

ORDER DETAILS:
${order.items
  .map(
    (item: any) =>
      `${item.title}
Qty: ${item.quantity} × Rs. ${item.price}${item.discount ? ` (${item.discount}% discount)` : ""}
Subtotal: Rs. ${(item.quantity * item.price * (1 - (item.discount || 0) / 100)).toFixed(0)}`,
  )
  .join("\n\n")}

Order Total: Rs. ${order.total.toFixed(0)}

SHIPPING ADDRESS:
${order.shippingName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingPostalCode}
${order.shippingPhone ? `Phone: ${order.shippingPhone}` : ""}

WHAT HAPPENS NEXT?
Our team will contact you at ${order.shippingPhone || order.shippingEmail} within 24 hours to confirm delivery details and arrange shipping.

ORDER PROCESS:
1. ✓ Processing - Preparing your order
2. Shipping - Out for delivery
3. Delivered - At your doorstep

CONTACT INFORMATION:
Email: contact@homagepublishers.com
Phone: +92-21-3277-8692
Website: www.homagepublishers.com

Thank you for choosing Homage Publishers
Your trusted partner in educational excellence
  `

  try {
    const { data, error } = await resend.emails.send({
      from: "Homage Publishers <orders@homagepublishers.com>",
      to: [order.shippingEmail],
      subject: `Order Confirmation #${order.id.slice(-6)} - Homage Publishers`,
      html,
      text,
    })

    if (error) {
      console.error("Failed to send order confirmation email:", error)
      return null
    }

    console.log("Order confirmation email sent successfully")
    console.log("Email ID:", data?.id)
    console.log("Sent to:", order.shippingEmail)

    return data
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
    return null
  }
}

/**
 * Sends a shipping notification email when order is out for delivery.
 */
export async function sendShippingNotificationEmail(order: any) {
  if (!order.shippingEmail) {
    console.error("No shippingEmail found on order:", order)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured. Please add it to your .env file.")
    return
  }

  const html = createEmailTemplate(order, {
    statusTitle: "Order Shipped",
    statusColor: "#2563eb",
    statusBgColor: "#eff6ff",
    statusMessage: `Great news! Your order <strong>#${order.id.slice(-6)}</strong> is now out for delivery.`,
    nextStepsTitle: "Track your delivery",
    nextStepsMessage: `Our delivery team will contact you shortly to arrange a convenient delivery time. Please keep your phone <strong>${order.shippingPhone || "available"}</strong> accessible.`,
    processingStep: 2
  })

  const text = `
HOMAGE PUBLISHERS
Educational Excellence Delivered

ORDER SHIPPED

Dear ${order.shippingName},

Great news! Your order #${order.id.slice(-6)} is now out for delivery.

ORDER DETAILS:
${order.items
  .map(
    (item: any) =>
      `${item.title}
Qty: ${item.quantity} × Rs. ${item.price}${item.discount ? ` (${item.discount}% discount)` : ""}
Subtotal: Rs. ${(item.quantity * item.price * (1 - (item.discount || 0) / 100)).toFixed(0)}`,
  )
  .join("\n\n")}

Order Total: Rs. ${order.total.toFixed(0)}

DELIVERY ADDRESS:
${order.shippingName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingPostalCode}
${order.shippingPhone ? `Phone: ${order.shippingPhone}` : ""}

TRACK YOUR DELIVERY:
Our delivery team will contact you shortly to arrange a convenient delivery time. Please keep your phone available.

ORDER PROCESS:
1. ✓ Processing - Preparing your order
2. ✓ Shipping - Out for delivery
3. Delivered - At your doorstep

CONTACT INFORMATION:
Email: contact@homagepublishers.com
Phone: +92-21-3277-8692
Website: www.homagepublishers.com

Thank you for choosing Homage Publishers
Your trusted partner in educational excellence
  `

  try {
    const { data, error } = await resend.emails.send({
      from: "Homage Publishers <orders@homagepublishers.com>",
      to: [order.shippingEmail],
      subject: `Order Shipped #${order.id.slice(-6)} - Homage Publishers`,
      html,
      text,
    })

    if (error) {
      console.error("Failed to send shipping notification email:", error)
      return null
    }

    console.log("Shipping notification email sent successfully")
    console.log("Email ID:", data?.id)
    console.log("Sent to:", order.shippingEmail)

    return data
  } catch (error) {
    console.error("Failed to send shipping notification email:", error)
    return null
  }
}

/**
 * Sends a delivery confirmation email when order is delivered.
 */
export async function sendDeliveryConfirmationEmail(order: any) {
  if (!order.shippingEmail) {
    console.error("No shippingEmail found on order:", order)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured. Please add it to your .env file.")
    return
  }

  const html = createEmailTemplate(order, {
    statusTitle: "Order Delivered",
    statusColor: "#059669",
    statusBgColor: "#ecfdf5",
    statusMessage: `Excellent! Your order <strong>#${order.id.slice(-6)}</strong> has been successfully delivered.`,
    nextStepsTitle: "Order completed",
    nextStepsMessage: `We hope you're satisfied with your educational materials. If you have any questions or concerns about your order, please don't hesitate to contact us at <strong>contact@homagepublishers.com</strong>.`,
    processingStep: 3
  })

  const text = `
HOMAGE PUBLISHERS
Educational Excellence Delivered

ORDER DELIVERED

Dear ${order.shippingName},

Excellent! Your order #${order.id.slice(-6)} has been successfully delivered.

ORDER DETAILS:
${order.items
  .map(
    (item: any) =>
      `${item.title}
Qty: ${item.quantity} × Rs. ${item.price}${item.discount ? ` (${item.discount}% discount)` : ""}
Subtotal: Rs. ${(item.quantity * item.price * (1 - (item.discount || 0) / 100)).toFixed(0)}`,
  )
  .join("\n\n")}

Order Total: Rs. ${order.total.toFixed(0)}

DELIVERED TO:
${order.shippingName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingPostalCode}
${order.shippingPhone ? `Phone: ${order.shippingPhone}` : ""}

ORDER COMPLETED:
We hope you're satisfied with your educational materials. If you have any questions or concerns about your order, please don't hesitate to contact us.

ORDER PROCESS:
1. ✓ Processing - Preparing your order
2. ✓ Shipping - Out for delivery
3. ✓ Delivered - At your doorstep

CONTACT INFORMATION:
Email: contact@homagepublishers.com
Phone: +92-21-3277-8692
Website: www.homagepublishers.com

Thank you for choosing Homage Publishers
Your trusted partner in educational excellence

We look forward to serving you again!
  `

  try {
    const { data, error } = await resend.emails.send({
      from: "Homage Publishers <orders@homagepublishers.com>",
      to: [order.shippingEmail],
      subject: `Order Delivered #${order.id.slice(-6)} - Homage Publishers`,
      html,
      text,
    })

    if (error) {
      console.error("Failed to send delivery confirmation email:", error)
      return null
    }

    console.log("Delivery confirmation email sent successfully")
    console.log("Email ID:", data?.id)
    console.log("Sent to:", order.shippingEmail)

    return data
  } catch (error) {
    console.error("Failed to send delivery confirmation email:", error)
    return null
  }
}

export async function sendContactFormEmail(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = formData;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; }
        .logo { max-width: 200px; height: auto; margin-bottom: 15px; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .form-section { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .form-row { margin-bottom: 15px; }
        .form-label { font-weight: 600; color: #374151; margin-bottom: 5px; display: block; font-size: 14px; }
        .form-value { color: #6b7280; font-size: 15px; line-height: 1.5; padding: 8px 0; }
        .message-box { background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 10px; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
        .alert-box { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .alert-text { color: #92400e; font-weight: 500; font-size: 14px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="https://homage-publishers.vercel.app/images/homage-logo-01.png" alt="Homage Educational Publishers" class="logo">
          <h1>New Contact Form Submission</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p style="color: #374151; font-size: 16px; margin-bottom: 25px;">
            You have received a new message through your website contact form.
          </p>

          <!-- Alert Box -->
          <div class="alert-box">
            <p class="alert-text">⚠️ New customer inquiry requires your attention</p>
          </div>

          <!-- Contact Form Details -->
          <div class="form-section">
            <h3 style="margin-top: 0; color: #374151; font-size: 18px;">Contact Details</h3>
            
            <div class="form-row">
              <label class="form-label">Full Name:</label>
              <div class="form-value">${name}</div>
            </div>

            <div class="form-row">
              <label class="form-label">Email Address:</label>
              <div class="form-value">
                <a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">Subject:</label>
              <div class="form-value">${subject}</div>
            </div>

            <div class="form-row">
              <label class="form-label">Message:</label>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>

          <!-- Response Actions -->
          <div style="background-color: #f0f9ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
            <h4 style="margin-top: 0; color: #0369a1; font-size: 16px;">Recommended Actions:</h4>
            <ul style="color: #075985; margin: 10px 0; padding-left: 20px;">
              <li>Reply to customer within 24 hours for best service</li>
              <li>Check if this is a bulk order inquiry</li>
              <li>Add customer to newsletter if appropriate</li>
              <li>Log inquiry in customer management system</li>
            </ul>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This email was automatically generated from your website contact form. 
            To reply, simply respond to <strong>${email}</strong>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Homage Educational Publishers</strong></p>
          <p>Office No. 7, Shan Plaza, Gawali Lane Number 2, New Urdu Bazar, Karachi</p>
          <p>📞 +92-21-3277-8692 | 📧 contact@homagepublishers.com</p>
          <p style="margin-top: 15px; color: #9ca3af; font-size: 12px;">
            Received: ${new Date().toLocaleString('en-US', { 
              timeZone: 'Asia/Karachi',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} (PKT)
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('Sending contact form email to info@homagepublishers.com');
    
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <noreply@homagepublishers.com>',
      to: ['info@homagepublishers.com'],
      subject: `New Contact: ${subject}`,
      html: emailHtml,
      replyTo: email, // Allow direct reply to customer
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send contact email: ${error.message}`);
    }

    console.log('Contact form email sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
} 

// Email template for booking confirmation
const getBookingConfirmationEmailTemplate = (bookingDetails) => {
  const { userName, eventName, eventDate, eventTime, eventAddress, eventCity, ticketType, ticketsCount, totalAmount, bookingReference } = bookingDetails;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                🎉 Booking Confirmed!
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Your tickets are ready
              </p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #f0fdf4; border-bottom: 3px solid #10b981;">
              <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">
                ✓ Payment Successful
              </div>
              <p style="margin: 15px 0 0 0; color: #065f46; font-size: 14px;">
                Booking Reference: <strong>${bookingReference}</strong>
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${userName}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Great news! Your booking for <strong>${eventName}</strong> has been confirmed. We can't wait to see you there!
              </p>
            </td>
          </tr>

          <!-- Event Details Card -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; color: #92400e; font-size: 20px; font-weight: bold; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
                      📅 Event Details
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px 0; color: #78350f; font-size: 14px; font-weight: 600; width: 40%;">
                          Event Name:
                        </td>
                        <td style="padding: 10px 0; color: #451a03; font-size: 14px;">
                          <strong>${eventName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #78350f; font-size: 14px; font-weight: 600;">
                          Date & Time:
                        </td>
                        <td style="padding: 10px 0; color: #451a03; font-size: 14px;">
                          <strong>${eventDate} at ${eventTime}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #78350f; font-size: 14px; font-weight: 600;">
                          Venue:
                        </td>
                        <td style="padding: 10px 0; color: #451a03; font-size: 14px;">
                          <strong>${eventAddress}, ${eventCity}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ticket Details Card -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ede9fe; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; color: #5b21b6; font-size: 20px; font-weight: bold; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
                      🎫 Ticket Information
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px 0; color: #6b21a8; font-size: 14px; font-weight: 600; width: 40%;">
                          Ticket Type:
                        </td>
                        <td style="padding: 10px 0; color: #3b0764; font-size: 14px;">
                          <strong>${ticketType}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #6b21a8; font-size: 14px; font-weight: 600;">
                          Quantity:
                        </td>
                        <td style="padding: 10px 0; color: #3b0764; font-size: 14px;">
                          <strong>${ticketsCount} ticket(s)</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #6b21a8; font-size: 14px; font-weight: 600;">
                          Total Amount:
                        </td>
                        <td style="padding: 10px 0; color: #3b0764; font-size: 18px;">
                          <strong style="color: #10b981;">$${totalAmount.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Information -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 16px; font-weight: bold;">
                  ⚠️ Important Information
                </h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                  <li>Please arrive at least 30 minutes before the event starts</li>
                  <li>Keep this email handy - you may need to show it at the venue</li>
                  <li>Your booking reference is: <strong>${bookingReference}</strong></li>
                  <li>Tickets are non-transferable and non-refundable</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                Need to make changes or have questions?
              </p>
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                View My Bookings
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Thanks for choosing our Event Management System!
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Event Management System. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Email template for booking cancellation
const getBookingCancellationEmailTemplate = (bookingDetails) => {
  const { userName, eventName, eventDate, eventTime, ticketType, ticketsCount, totalAmount, bookingReference } = bookingDetails;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                Booking Cancelled
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Your cancellation has been processed
              </p>
            </td>
          </tr>

          <!-- Cancellation Notice -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #fef2f2; border-bottom: 3px solid #ef4444;">
              <div style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">
                ✗ Booking Cancelled
              </div>
              <p style="margin: 15px 0 0 0; color: #991b1b; font-size: 14px;">
                Booking Reference: <strong>${bookingReference}</strong>
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${userName}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Your booking for <strong>${eventName}</strong> has been successfully cancelled. We're sorry to see you go!
              </p>
            </td>
          </tr>

          <!-- Cancelled Booking Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fee2e2; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; color: #991b1b; font-size: 20px; font-weight: bold; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
                      📋 Cancelled Booking Details
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px 0; color: #991b1b; font-size: 14px; font-weight: 600; width: 40%;">
                          Event Name:
                        </td>
                        <td style="padding: 10px 0; color: #7f1d1d; font-size: 14px;">
                          <strong>${eventName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                          Date & Time:
                        </td>
                        <td style="padding: 10px 0; color: #7f1d1d; font-size: 14px;">
                          <strong>${eventDate} at ${eventTime}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                          Ticket Type:
                        </td>
                        <td style="padding: 10px 0; color: #7f1d1d; font-size: 14px;">
                          <strong>${ticketType}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                          Quantity:
                        </td>
                        <td style="padding: 10px 0; color: #7f1d1d; font-size: 14px;">
                          <strong>${ticketsCount} ticket(s)</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                          Amount:
                        </td>
                        <td style="padding: 10px 0; color: #7f1d1d; font-size: 14px;">
                          <strong>$${totalAmount.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Refund Information -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: bold;">
                  💳 Refund Information
                </h3>
                <p style="margin: 10px 0 0 0; color: #78350f; font-size: 14px; line-height: 1.8;">
                  As per our cancellation policy, tickets are non-refundable. However, if you have any concerns or special circumstances, please contact our support team.
                </p>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                Changed your mind or looking for other events?
              </p>
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                Browse Events
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                We hope to see you at another event soon!
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Event Management System. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  getBookingConfirmationEmailTemplate,
  getBookingCancellationEmailTemplate,
};
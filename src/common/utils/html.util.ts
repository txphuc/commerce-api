export function getConfirmEmail(confirmationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
      <div style="width: 100% !important; max-width: 600px !important; margin: 0 auto !important; padding: 50px !important; font-family: Arial, sans-serif !important; background-color: #f5f5f5 !important;">
        <img src="https://i.ibb.co/S54SQqn/received-796319738324277-1.webp" alt="Logo" style="display: block !important; margin: 0 auto !important; width: 250px !important; border-radius: 50% !important; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;">
        <h2 style="font-size: 30px !important; color: #101010 !important">Confirm your email</h2>
        <p style="font-size: 22px !important; color: #101010 !important">Thank you for signing up! Please confirm your email address by clicking the button below:</p>
        <div style="text-align: center !important;">
          <a href="${confirmationUrl}" style="display: inline-block !important; background-color: #1976d2 !important; color: #ffffff !important; padding: 15px 40px !important; border-radius: 10px !important; text-decoration: none !important; font-weight: bold !important; font-size: 20px !important; transition: background-color 0.3s ease !important; border: none !important;">Confirm Email</a>
        </div>
      </div>
    </body>
    </html>
    `;
}

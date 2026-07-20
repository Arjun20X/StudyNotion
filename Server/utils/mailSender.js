const mailSender = async (email, title, body) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { 
                    email: process.env.MAIL_USER, 
                    name: 'StudyNotion' 
                },
                to: [{ email: email }],
                subject: title,
                htmlContent: body
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Brevo API Error:", data);
            return data;
        }

        console.log("Email sent successfully via Brevo:", data);
        return data;
    } catch (error) {
        console.error("Failed to send email:", error.message);
        return error.message;
    }
};

module.exports = mailSender;
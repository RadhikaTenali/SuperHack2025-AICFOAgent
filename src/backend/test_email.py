import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_email():
    """Test if email sending works"""
    try:
        # Get credentials from .env file
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        port = int(os.getenv('SMTP_PORT', '587'))
        sender_email = os.getenv('SENDER_EMAIL')
        password = os.getenv('EMAIL_PASSWORD')
        
        print(f"Testing email with: {sender_email}")
        print(f"Password length: {len(password) if password else 'None'}")
        
        if not sender_email or not password:
            print("❌ ERROR: Missing email credentials in .env file")
            return False
        
        # Create test email
        message = MIMEMultipart("alternative")
        message["Subject"] = "AI CFO Agent - Email Test"
        message["From"] = sender_email
        message["To"] = sender_email  # Send to yourself for testing
        
        # Simple text content
        text_content = """
        AI CFO Agent - Email Test
        
        This is a test email from your AI CFO Agent!
        
        Test Results:
        ✅ SMTP Connection: Working
        ✅ Authentication: Successful  
        ✅ Email Delivery: Functional
        
        Your AI CFO Agent email system is ready!
        """
        
        text_part = MIMEText(text_content, "plain")
        message.attach(text_part)
        
        # Send email
        print("Connecting to Gmail SMTP server...")
        context = ssl.create_default_context()
        
        with smtplib.SMTP(smtp_server, port) as server:
            print("Starting TLS encryption...")
            server.starttls(context=context)
            
            print("Logging in...")
            server.login(sender_email, password)
            
            print("Sending email...")
            server.sendmail(sender_email, sender_email, message.as_string())
        
        print("✅ SUCCESS! Test email sent successfully!")
        print(f"📧 Check your Gmail inbox: {sender_email}")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        
        error_msg = str(e).lower()
        if "authentication failed" in error_msg:
            print("\n🔧 Authentication Error - Try this:")
            print("1. Double-check your Gmail app password (should be 16 chars)")
            print("2. Make sure 2-Step Verification is ON in Gmail")
            print("3. Create a new app password if needed")
        elif "connection" in error_msg:
            print("\n🔧 Connection Error - Try this:")
            print("1. Check your internet connection")
            print("2. Try again in a few seconds")
        
        return False

if __name__ == "__main__":
    test_email()

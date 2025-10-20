import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.port = int(os.getenv('SMTP_PORT', '587'))
        self.sender_email = os.getenv('SENDER_EMAIL')
        self.password = os.getenv('EMAIL_PASSWORD')
        
        logger.info(f"📧 EmailService initialized:")
        logger.info(f"   SMTP Server: {self.smtp_server}:{self.port}")
        logger.info(f"   Sender Email: {self.sender_email}")
        logger.info(f"   Password Length: {len(self.password) if self.password else 'None'}")
        
    def send_weekly_report(self, recipient_email, report_data):
        """Send weekly financial report via email"""
        try:
            logger.info(f"🚀 Starting email send to: {recipient_email}")
            
            if not self.sender_email or not self.password:
                error_msg = "❌ Missing email credentials in .env file"
                logger.error(error_msg)
                return {"success": False, "message": error_msg}
            
            message = MIMEMultipart("alternative")
            message["Subject"] = f"AI CFO Agent - Weekly Financial Report - {datetime.now().strftime('%B %d, %Y')}"
            message["From"] = self.sender_email
            message["To"] = recipient_email

            logger.info(f"📝 Email created with subject: {message['Subject']}")

            # Create professional HTML email content
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2196F3; border-bottom: 3px solid #2196F3; padding-bottom: 10px;">
                        🤖 AI CFO Agent - Weekly Financial Report
                    </h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1565C0; margin-top: 0;">📊 Executive Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">💰 Monthly Revenue:</td>
                                <td style="padding: 8px 0; color: #4CAF50;">${report_data.get('revenue', '10,000')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">📈 Net Margin:</td>
                                <td style="padding: 8px 0; color: #4CAF50;">${report_data.get('margin', '2,000')} (20%)</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">💎 Potential Savings:</td>
                                <td style="padding: 8px 0; color: #FF9800;">${report_data.get('savings', '7,872')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">🚀 Upsell Opportunities:</td>
                                <td style="padding: 8px 0; color: #9C27B0;">${report_data.get('upsell', '72,000')}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #856404; margin-top: 0;">⚡ Priority Actions This Week</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="margin: 8px 0;"><strong>HIGH:</strong> Renegotiate TechCorp Solutions contract ($6,000 annual impact)</li>
                            <li style="margin: 8px 0;"><strong>MEDIUM:</strong> Present cybersecurity upsell to TechCorp ($33,600 potential)</li>
                            <li style="margin: 8px 0;"><strong>MEDIUM:</strong> Optimize Microsoft 365 licenses ($2,880 savings)</li>
                            <li style="margin: 8px 0;"><strong>MEDIUM:</strong> Present upsell to HealthFirst Medical ($14,400 potential)</li>
                        </ul>
                    </div>
                    
                    <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
                    
                    <div style="text-align: center; color: #666; font-size: 12px;">
                        <p>📧 Generated automatically by AI CFO Agent</p>
                        <p>🕒 Report Date: {datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}</p>
                        <p>🤖 This report is delivered weekly to help optimize your MSP's financial performance</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            logger.info("🔌 Connecting to Gmail SMTP server...")
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                logger.info("🔒 Starting TLS encryption...")
                server.starttls(context=context)
                
                logger.info("🔑 Authenticating...")
                server.login(self.sender_email, self.password)
                
                logger.info("📤 Sending email...")
                server.sendmail(self.sender_email, recipient_email, message.as_string())
                
            logger.info("✅ Email sent successfully!")
                
            return {
                "success": True, 
                "message": f"Weekly report sent successfully to {recipient_email}",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            error_msg = f"Failed to send email: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return {
                "success": False, 
                "message": error_msg,
                "timestamp": datetime.now().isoformat()
            }
    
    def send_proposal_email(self, client_email, proposal_data):
        """Send generated proposal to client"""
        try:
            logger.info(f"🚀 Starting proposal email send to: {client_email}")
            
            message = MIMEMultipart("alternative")
            message["Subject"] = f"Service Proposal - {proposal_data.get('service_name', 'Enhanced Services')}"
            message["From"] = self.sender_email
            message["To"] = client_email

            # Generate proposal email
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2196F3;">Service Proposal: {proposal_data.get('service_name', 'Enhanced Services')}</h2>
                    
                    <p>Dear {proposal_data.get('client_name', 'Valued Client')} Team,</p>
                    
                    <p>I hope you're doing well. Based on our analysis of your recent IT activity, we've identified an opportunity to enhance your infrastructure with our {proposal_data.get('service_name', 'Enhanced Services')}.</p>
                    
                    <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1565C0;">Key Benefits:</h3>
                        <ul>
                            <li>Enhanced security monitoring and support</li>
                            <li>Reduced downtime and security risks</li>
                            <li>Compliance with industry standards</li>
                            <li>Proactive monitoring and prevention</li>
                        </ul>
                        
                        <h3 style="color: #1565C0;">Investment:</h3>
                        <table style="width: 100%; background: white; padding: 15px; border-radius: 5px;">
                            <tr>
                                <td style="font-weight: bold;">Monthly:</td>
                                <td style="color: #4CAF50; font-size: 18px;">${proposal_data.get('monthly_cost', '2,000')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Annual:</td>
                                <td style="color: #4CAF50; font-size: 18px;">${proposal_data.get('annual_cost', '24,000')}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>We're confident this solution will address your current challenges and position your business for continued growth.</p>
                    
                    <p>I'd love to discuss how this can benefit your organization. Are you available for a 15-minute call this week?</p>
                    
                    <p>Best regards,<br>
                    <strong>Your AI CFO Agent</strong><br>
                    Automated Financial Analysis System</p>
                    
                    <hr style="margin: 30px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        🤖 This proposal was generated by AI CFO Agent based on data analysis<br>
                        Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
                    </p>
                </div>
            </body>
            </html>
            """
            
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                logger.info("🔒 Starting TLS encryption...")
                server.starttls(context=context)
                
                logger.info("🔑 Authenticating...")
                server.login(self.sender_email, self.password)
                
                logger.info("📤 Sending proposal email...")
                server.sendmail(self.sender_email, client_email, message.as_string())
                
            logger.info("✅ Proposal email sent successfully!")
                
            return {
                "success": True,
                "message": f"Proposal sent successfully to {client_email}",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            error_msg = f"Failed to send proposal: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return {
                "success": False,
                "message": error_msg,
                "timestamp": datetime.now().isoformat()
            }

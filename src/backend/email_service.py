"""
Email Service Module
Real SMTP email service for AI CFO Agent
Sends weekly reports and proposals via Gmail SMTP
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
from datetime import datetime
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailService:
    """
    Real SMTP Email Service for AI CFO Agent
    Sends professional emails via Gmail SMTP
    """
    
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.port = 587
        self.sender_email = os.getenv('EMAIL_ADDRESS', 'your_email@gmail.com')
        self.password = os.getenv('EMAIL_PASSWORD', 'your_app_password')
        
        logger.info("✅ EmailService initialized")
        logger.info(f"📧 Sender email: {self.sender_email}")
        logger.info(f"🔐 Password configured: {'✅' if self.password else '❌'}")
    
    def send_weekly_report(self, recipient_email, report_data):
        """
        Send weekly financial report via Gmail SMTP
        
        Args:
            recipient_email (str): Recipient's email address
            report_data (dict): Report data with revenue, margin, savings, upsell
            
        Returns:
            dict: Success status and message
        """
        try:
            logger.info(f"📧 Sending weekly report to: {recipient_email}")
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = "🤖 AI CFO Agent - Weekly Financial Report"
            message["From"] = self.sender_email
            message["To"] = recipient_email

            # Get current date for report
            report_date = datetime.now().strftime("%B %d, %Y")
            
            # Create professional HTML email
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI CFO Agent - Weekly Report</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
                <div style="max-width: 650px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 300;">🤖 AI CFO Agent</h1>
                        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Weekly Financial Report</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">📅 {report_date}</p>
                    </div>

                    <!-- Executive Summary -->
                    <div style="padding: 30px;">
                        <h2 style="color: #1976d2; border-bottom: 3px solid #e3f2fd; padding-bottom: 10px; margin-bottom: 25px;">
                            📊 Executive Summary
                        </h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-bottom: 30px;">
                            
                            <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">💰</div>
                                <div style="font-size: 20px; font-weight: bold;">${report_data.get('revenue', '10,000')}</div>
                                <div style="font-size: 12px; opacity: 0.9;">Monthly Revenue</div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">📈</div>
                                <div style="font-size: 20px; font-weight: bold;">${report_data.get('margin', '2,000')}</div>
                                <div style="font-size: 12px; opacity: 0.9;">Net Margin</div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">💎</div>
                                <div style="font-size: 20px; font-weight: bold;">${report_data.get('savings', '7,872')}</div>
                                <div style="font-size: 12px; opacity: 0.9;">Potential Savings</div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">🚀</div>
                                <div style="font-size: 20px; font-weight: bold;">${report_data.get('upsell', '72,000')}</div>
                                <div style="font-size: 12px; opacity: 0.9;">Upsell Potential</div>
                            </div>
                            
                        </div>

                        <!-- Priority Actions -->
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">⚡ Priority Actions This Week</h3>
                            <ul style="color: #856404; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;"><strong>HIGH:</strong> Renegotiate TechCorp Solutions contract ($6,000 annual loss)</li>
                                <li style="margin-bottom: 8px;"><strong>MEDIUM:</strong> Present cybersecurity upsell to TechCorp ($33,600 potential)</li>
                                <li style="margin-bottom: 8px;"><strong>MEDIUM:</strong> Optimize Microsoft 365 licenses ($2,880 annual savings)</li>
                                <li style="margin-bottom: 8px;"><strong>MEDIUM:</strong> Present compliance upsell to HealthFirst ($14,400 potential)</li>
                            </ul>
                        </div>

                        <!-- Key Insights -->
                        <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                            <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 18px;">🤖 AI Insights</h3>
                            <p style="margin: 0; color: #1976d2; font-size: 14px;">
                                Your MSP is performing well with a <strong>20% margin rate</strong>. Focus on the 1 at-risk client 
                                to prevent revenue loss, and pursue the <strong>${report_data.get('upsell', '72,000')}</strong> in identified 
                                upsell opportunities to boost growth. License optimization could save an additional 
                                <strong>${report_data.get('savings', '7,872')}</strong> annually.
                            </p>
                        </div>

                        <!-- Performance Metrics -->
                        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px;">
                            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📊 Quick Stats</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; font-size: 14px;">
                                <div><strong>Total Clients:</strong> 3</div>
                                <div><strong>Profitable Clients:</strong> 2</div>
                                <div><strong>Revenue/Client:</strong> $3,333</div>
                                <div><strong>Annual Projection:</strong> $120,000</div>
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #6c757d; font-size: 13px;">
                            🤖 <strong>Generated automatically by AI CFO Agent</strong><br>
                            📧 This report is delivered weekly to optimize your MSP's financial performance<br>
                            🔗 <em>Powered by Autonomous AI Financial Analysis</em>
                        </p>
                    </div>

                </div>
            </body>
            </html>
            """

            # Convert to MIMEText
            html_part = MIMEText(html, "html")
            message.attach(html_part)

            # Send email via SMTP
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                logger.info("🔗 Connecting to Gmail SMTP server...")
                server.starttls(context=context)
                logger.info("🔐 Starting TLS encryption...")
                server.login(self.sender_email, self.password)
                logger.info("✅ Authentication successful")
                server.sendmail(self.sender_email, recipient_email, message.as_string())
                logger.info("📧 Email sent successfully!")

            return {
                "success": True,
                "message": f"✅ Weekly report sent successfully to {recipient_email}!"
            }

        except Exception as e:
            error_msg = f"❌ Failed to send weekly report: {str(e)}"
            logger.error(error_msg)
            return {
                "success": False,
                "message": error_msg
            }

    def send_proposal_email(self, client_email, proposal_data):
        """
        Send service proposal email via Gmail SMTP
        
        Args:
            client_email (str): Client's email address
            proposal_data (dict): Proposal data with service details
            
        Returns:
            dict: Success status and message
        """
        try:
            logger.info(f"📧 Sending proposal to: {client_email}")
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = f"💼 Service Proposal - {proposal_data.get('service_name', 'Premium Service Package')}"
            message["From"] = self.sender_email
            message["To"] = client_email

            # Get current date
            current_date = datetime.now().strftime("%B %d, %Y")
            
            # Create professional proposal HTML
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Service Proposal</title>
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 300;">💼 Service Proposal</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Professional MSP Services</p>
                    </div>

                    <div style="padding: 30px;">
                        <p style="font-size: 16px; margin-bottom: 25px;">
                            Dear <strong>{proposal_data.get('client_name', 'Valued Client')}</strong>,
                        </p>
                        
                        <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
                            We're excited to present our comprehensive service proposal tailored specifically for your organization's needs.
                        </p>

                        <!-- Service Details -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                            <h3 style="margin: 0 0 20px 0; font-size: 20px;">📋 Proposal Details</h3>
                            
                            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                                <p style="margin: 0 0 10px 0; font-size: 16px;">
                                    <strong>Service:</strong> {proposal_data.get('service_name', 'Premium Cybersecurity Package')}
                                </p>
                                <p style="margin: 0 0 10px 0; font-size: 16px;">
                                    <strong>Monthly Investment:</strong> ${proposal_data.get('monthly_cost', '2,000')}
                                </p>
                                <p style="margin: 0; font-size: 16px;">
                                    <strong>Annual Investment:</strong> ${proposal_data.get('annual_cost', '24,000')}
                                </p>
                            </div>
                        </div>

                        <!-- Benefits -->
                        <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #2e7d2e; margin: 0 0 15px 0; font-size: 18px;">✨ Key Benefits</h3>
                            <ul style="color: #2e7d2e; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Enhanced security posture and threat protection</li>
                                <li style="margin-bottom: 8px;">24/7 monitoring and incident response</li>
                                <li style="margin-bottom: 8px;">Compliance with industry standards</li>
                                <li style="margin-bottom: 8px;">Dedicated support from certified professionals</li>
                                <li>Regular reporting and performance analytics</li>
                            </ul>
                        </div>

                        <!-- Next Steps -->
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">🚀 Next Steps</h3>
                            <p style="color: #856404; margin: 0; font-size: 14px;">
                                Let's schedule a call to discuss implementation details and address any questions you may have. 
                                We're committed to providing exceptional value and ensuring a smooth transition.
                            </p>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <p style="font-size: 16px; color: #333;">
                                We look forward to partnering with you!
                            </p>
                            <p style="font-size: 14px; color: #666; margin: 20px 0;">
                                Best regards,<br>
                                <strong>Your AI CFO Agent Team</strong><br>
                                🤖 Powered by Intelligent Business Analytics
                            </p>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #6c757d; font-size: 12px;">
                            📅 Proposal Date: {current_date}<br>
                            📧 This proposal was generated and sent automatically by AI CFO Agent
                        </p>
                    </div>

                </div>
            </body>
            </html>
            """

            # Convert to MIMEText
            html_part = MIMEText(html, "html")
            message.attach(html_part)

            # Send email via SMTP
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                logger.info("🔗 Connecting to Gmail SMTP server...")
                server.starttls(context=context)
                logger.info("🔐 Starting TLS encryption...")
                server.login(self.sender_email, self.password)
                logger.info("✅ Authentication successful")
                server.sendmail(self.sender_email, client_email, message.as_string())
                logger.info("📧 Proposal sent successfully!")

            return {
                "success": True,
                "message": f"✅ Proposal sent successfully to {client_email}!"
            }

        except Exception as e:
            error_msg = f"❌ Failed to send proposal: {str(e)}"
            logger.error(error_msg)
            return {
                "success": False,
                "message": error_msg
            }

# Test function for debugging
def test_email_service():
    """Test the email service functionality"""
    email_service = EmailService()
    
    # Test data
    test_report_data = {
        'revenue': '10,000',
        'margin': '2,000',
        'savings': '7,872',
        'upsell': '72,000'
    }
    
    # Send test email
    result = email_service.send_weekly_report('cheatercock911@gmail.com', test_report_data)
    print(f"Test result: {result}")

if __name__ == "__main__":
    test_email_service()

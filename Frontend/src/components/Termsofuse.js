import React from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Scrolltotopbtn from "./Scrolltotopbutton";

export default function Termsofuse() {
  const Terms = [
    {
      heading: "Introduction",
      description: [
        "Welcome to TheResaleBazaar. These Terms of Use constitute a legally binding agreement between you (the user), and Resale Bazaar. By accessing, browsing, or using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please refrain from using the Site.",
        "Resale Bazaar is an online platform that facilitates the purchase and sale of second-hand clothing. These Terms govern your access to and use of the Site, including any services, features, content, and transactions made through the Site.",
      ],
    },
    {
      heading: "Eligibility",
      description: [
        "The Site is intended solely for users who are at least 18 years old. By accessing or using Resale Bazaar, you represent and warrant that you are of legal age to form a binding contract and meet all the eligibility requirements. If you do not meet these requirements, you must not use the Site.",
      ],
    },
    {
      heading: "Account Registration and Responsibilities",
      description: [
        {
          subheading: "Account Creation",
          content:
            "To make purchases or sell items through Resale Bazaar, you must create an account. When registering, you agree to provide accurate, current, and complete information.",
        },
        {
          subheading: "Account Security",
          content:
            "You are responsible for safeguarding the confidentiality of your login information and for any activity that occurs under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.",
        },
        {
          subheading: "Account Termination",
          content:
            "We reserve the right to suspend or terminate your account at any time if you violate these Terms, engage in fraudulent activities, or misuse the Site in any way.",
        },
      ],
    },
    {
      heading: "Product Listings and Descriptions",
      description: [
        {
          subheading: "Accuracy of Listings",
          content:
            "While we strive to ensure that product listings are as accurate as possible, Resale Bazaar makes no representations regarding the completeness, accuracy, reliability, or timeliness of any product descriptions or images. All items sold on the Site are second-hand and may show signs of previous use.",
        },
        {
          subheading: "Condition of Products",
          content:
            "Buyers acknowledge that they are purchasing used clothing and that the condition of items will vary. We do our best to provide detailed descriptions, but minor imperfections may not always be noted.",
        },
      ],
    },
    {
      heading: "Pricing and Payments",
      description: [
        {
          subheading: "Pricing",
          content:
            "All prices listed on the Site are in dollars and are subject to change at any time without notice. We reserve the right to correct any pricing errors or inaccuracies.",
        },
        {
          subheading: "Payment Methods",
          content:
            "We accept payments through authorized payment processors, including credit cards, PayPal, and other methods indicated on the Site. By providing your payment information, you authorize us to charge the applicable fees.",
        },
        {
          subheading: "Taxes and Fees",
          content:
            "Any applicable taxes, duties, or shipping fees will be calculated and displayed at checkout. You are responsible for paying all such amounts in connection with your order.",
        },
      ],
    },
    {
      heading: "Shipping, Delivery, and Risk of Loss",
      description: [
        {
          subheading: "Shipping Policy",
          content:
            "We ship items only to addresses within the designated shipping regions listed on our Site. Shipping charges and delivery times will be provided at checkout.",
        },
        {
          subheading: "Risk of Loss",
          content:
            "Title and risk of loss for items purchased pass to the buyer upon delivery to the carrier. We are not responsible for delays or damages caused by shipping carriers.",
        },
        {
          subheading: "Tracking Information",
          content:
            "Once your item has been shipped, we will provide you with tracking information so you can monitor the progress of your order.",
        },
      ],
    },
    {
      heading: "Returns, Refunds, and Cancellations",
      description: [
        {
          subheading: "Return Policy",
          content:
            "We accept returns within 7 days of receipt if the item is not as described or is defective. To initiate a return, please contact our customer service team at theresalebazaar@gmail.com . The item must be in the same condition in which it was received, along with any original packaging and documentation.",
        },
        {
          subheading: "Refund Process",
          content:
            "Refunds will be processed within 5 days after receiving and inspecting the returned item. The original payment method will be credited.",
        },
        {
          subheading: "Return Shipping Costs",
          content:
            "Return shipping costs are the responsibility of the buyer unless the item was misrepresented on the Site or arrives damaged.",
        },
        {
          subheading: "Cancellations",
          content:
            "Once an order has been placed, it cannot be canceled unless the item has not yet been shipped. Please contact customer service to inquire about cancellations.",
        },
      ],
    },
    {
      heading: "User Conduct",
      description: [
        "You agree not to use the Site for any unlawful purpose or in any manner that could damage, disable, or impair the Site. Prohibited conduct includes, but is not limited to, engaging in fraud, harassment, or posting offensive, misleading, or false information. Resale Bazaar reserves the right to investigate and take appropriate legal action against any user who violates these Terms.",
      ],
    },
    {
      heading: "Intellectual Property",
      description: [
        {
          subheading: "Ownership of Content",
          content:
            "All content on the Site, including text, images, graphics, logos, and software, is the property of Resale Bazaar or our licensors and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use of this content is strictly prohibited.",
        },
        {
          subheading: "Limited License",
          content:
            "We grant you a limited, non-exclusive, non-transferable, and revocable license to use the Site for personal and non-commercial purposes in accordance with these Terms.",
        },
      ],
    },
    {
      heading: "Limitation of Liability",
      description: [
        "To the maximum extent permitted by law, Resale Bazaar shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use or inability to use the Site or its content. This includes, but is not limited to, damages for lost profits, lost data, or business interruption.",
      ],
    },
    {
      heading: "Governing Law and Dispute Resolution",
      description: [
        "These Terms are governed by and construed in accordance with the laws of United States, without regard to its conflict of law provisions. Any disputes arising out of or related to these Terms shall be resolved exclusively in the courts of United States.",
      ],
    },
    {
      heading: "Amendments to the Terms",
      description: [
        "We may modify or update these Terms at any time. Any changes will be effective upon posting on the Site, and your continued use of the Site after such changes constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.",
      ],
    },
  ];
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div className="container pt-5 pb-5">
          <h1>Terms of Use</h1>
          <div className="pt-3">
            {Terms.map((item, index) => (
              <div key={index}  style={{lineHeight:'30px' , marginTop:"40px"}}>
                <h5>{item.heading}</h5>
                {item.description.map((subItem, subindex) => (
                  <div key={subindex}>
                    {typeof subItem === "string" ? (
                      <p className="">{subItem}</p>
                    ) : (
                        <ul>
                            <li>{subItem.subheading} : {subItem.content}</li>
                        </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Scrolltotopbtn />
    </div>
  );
}

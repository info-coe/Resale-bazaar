import React from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";
import Scrolltotopbtn from "./Scrolltotopbutton";

export default function Privacypolicy() {
  const privacypolicy = [
    {
      heading: "Introduction",
      description: [
        "At Resale Bazaar, we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website. By using the Site, you agree to the collection and use of your information in accordance with this policy.",
      ],
    },
    {
      heading: "Information We Collect",
      description: [
        {
          subheading: "Personal Information",
          content:
            "When you create an account, make a purchase, or contact customer service, we collect personal information such as your name, email address, shipping address, payment details, and telephone number.",
        },
        {
          subheading: "Non-Personal Information",
          content:
            "We automatically collect non-personal data about your interactions with the Site, such as your IP address, browser type, operating system, and browsing activity, using cookies and other tracking technologies.",
        },
      ],
    },
    {
      heading: "How We Use Your Information",
      description: [
        {
          subheading: "We use the information we collect to",
          content: [
            "Process your transactions and fulfill your orders.",
            "Communicate with you regarding your orders, account, or customer service inquiries.",
            "Personalize your experience on the Site by displaying content and products relevant to you.",
            "Send you promotional offers and updates (with your consent).",
            "Improve the functionality and performance of the Site.",
          ],
        },
      ],
    },
    {
      heading: "Sharing Your Information",
      description: [
        {
          subheading: "Service Providers",
          content:
            "We may share your personal information with third-party service providers who assist us with payment processing, order fulfillment, marketing, and website operations. These providers are only authorized to use your information as necessary to perform their services.",
        },
        {
          subheading: "Legal Obligations",
          content:
            "We may disclose your personal information if required to do so by law or in response to valid legal requests, such as subpoenas or court orders.",
        },
      ],
    },
    {
      heading: "Cookies and Tracking Technologies",
      description: [
        "Resale Bazaar uses cookies to enhance your browsing experience. Cookies allow us to recognize you when you return to the Site, personalize your experience, and analyse site usage. You can adjust your browser settings to refuse cookies, but doing so may limit your ability to use certain features of the Site.",
      ],
    },
    {
      heading: "Data Security",
      description: [
        "We implement a variety of security measures, including encryption and secure server technologies, to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Your Data Rights",
      description: [
        {
          subheading: "Access and Correction",
          content:
            "You can access and update your personal information through your account settings at any time",
        },
        {
          subheading: "Data Deletion",
          content:
            "You may request that we delete your personal information by contacting us at theresalebazaar@gmail.com . We will comply with your request unless we are legally obligated to retain certain information.",
        },
        {
          subheading: "Opt-Out",
          content:
            "You may opt out of receiving promotional emails by following the unsubscribe instructions in those emails.",
        },
      ],
    },
    {
      heading: "Data Retention",
      description: [
        "We retain personal data for as long as necessary to fulfill the purposes for which it was collected or as required by law. This includes keeping records of purchases and communications for legal or compliance purposes.",
      ],
    },
    {
      heading: "Children’s Privacy",
      description: [
        "Resale Bazaar does not knowingly collect personal information from individuals under the age of 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it promptly.",
      ],
    },
    {
      heading: "Third-Party Links",
      description: [
        "Our Site may contain links to third-party websites. Resale Bazaar is not responsible for the privacy practices or content of those external sites. We encourage you to review their privacy policies before providing any personal information.",
      ],
    },
    {
      heading: "Changes to the Privacy Policy",
      description: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting an updated version on the Site.",
      ],
    },
    {
      heading: "Contact Information",
      description: [
        "If you have any questions about this Privacy Policy, please contact us at <a  href='mailto:theresalebazaar@gmail.com' class='text-decoration-none text-dark fw-bold'>theresalebazaar@gmail.com.</a>",
      ],
    },
  ];
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <div className="container pt-5 pb-5">
          <h1>Privacy Policy</h1>
          <div className="pt-3">
            {privacypolicy.map((item, index) => (
              <div key={index} style={{lineHeight:'30px' , marginTop:"40px"}}>
                <h5 >{item.heading}</h5>
                {item.description.map((subItem, subindex) => (
                  <div key={subindex} >
                    {typeof subItem === "string" ? (
                      <p className="" dangerouslySetInnerHTML={{ __html: subItem }} />
                    ) : (
                      <ul>
                        <li>
                          {subItem.subheading} :{" "}
                          {typeof subItem.content === "string" ? (
                            <>{subItem.content}</>
                          ) : (
                            <>
                              {Array.isArray(subItem.content) &&
                                subItem.content.map((childItem, childIndex) => (
                                  <ul>
                                    <li>{childItem}</li>
                                  </ul>
                                ))}
                            </>
                          )}
                        </li>
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

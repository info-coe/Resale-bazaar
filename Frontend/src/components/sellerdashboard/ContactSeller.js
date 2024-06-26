import React,{useState,useEffect} from "react";
import MyNavbar from "../navbar";
import axios from "axios";
import Footer from "../footer";
import messageemptyimg from '../../images/messagesempty.png'
const ContactSeller = () => {
  const [contactData,SetContactData]=useState([])
  const SellerId = parseInt(sessionStorage.getItem("user-token"));
  console.log(SellerId)

  useEffect(() => {
    // Fetch all products
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/contactseller`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
        const filterContactData = res.data.filter((item)=>item.seller_id === SellerId)
        
          SetContactData(filterContactData);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });

  
  }, [SellerId]);
  return(
    <>
    <MyNavbar/>
    <div className="col-lg-12 p-lg-4 p-2 text-center">
            
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Comment</th>
                  </tr>
                </thead>

                <tbody>
                   {
                    contactData.length > 0 ? (
                        contactData.map((user,index)=>(
                            <tr key={index}>
                            <td className="text-secondary">
                                {user.name}
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.phone}
                            </td>
                            <td>
                                {user.comment}
                            </td>
                          </tr>
                        ))
                    ):(
                        <>
                        <tr>
              <td colSpan={4} className="text-center">
              <img src={messageemptyimg} alt="Your Cart is Empty" width="280" height="280" style={{objectFit:"contain"}}/>
              </td>
            </tr>
                        </>
                    )
                   }
                  
                </tbody>
              </table>
          </div>
          <Footer/>
    </>
  )
};

export default ContactSeller;
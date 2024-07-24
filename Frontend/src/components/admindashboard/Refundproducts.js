import React, { useEffect, useState } from 'react'
import Adminfooter from './Adminfooter'
import Adminmenu from './Adminmenu'
import Adminnavbar from './Adminnavbar'
import axios from 'axios'
import Adminpagination from './Adminpagination'

const Refundproducts = () => {
const [refundproducts,setRefundProducts] = useState([])
const [pageSize, setPageSize] = useState(25);
const [currentPage, setCurrentPage] = useState(1);
const [viewRowIndex, setViewRowIndex] = useState(null);

    useEffect(()=>{
            axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/refundproducts`).then((res)=>{
                  if(res.data !== "Fail" && res.data !== "Error"){
                    setRefundProducts(res.data)
                  }
            }).catch((err)=>{
                console.log(err)
            })
    },[])
    useEffect(() => {
        setCurrentPage(1);
        setViewRowIndex(null);
      }, [pageSize]);
    
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const tableData = refundproducts.slice(startIndex, endIndex);
  return (
    <div className="fullscreen">
    <Adminnavbar />
    <div className="d-md-flex">
      <div className="col-md-2 selleraccordion">
        <Adminmenu />
      </div>
      <div className="col-md-10 ">
        <div className="fullscreen2">
          <main>
            <div className="border m-3 rounded">
              <div className="table-responsive p-3">
                <table
                  id="dynamic-table"
                  className="table table-striped table-bordered table-hover dataTable no-footer"
                  role="grid"
                  aria-describedby="dynamic-table_info"
                >
                  <thead className="">
                    <tr role="row">
                      <th className='p-3'>Product Id</th>
                      <th
                        className="sorting p-3"
                        tabIndex="0"
                        aria-controls="dynamic-table"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="ID: activate to sort column ascending"
                      >
                        Product Image
                      </th>
                      <th
                        className="sorting p-3"
                        tabIndex="0"
                        aria-controls="dynamic-table"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Address:activate to sort column ascending"
                      >
                        Product Name
                      </th>
                      <th
                        className="hidden-480 sorting p-3"
                        tabIndex="0"
                        aria-controls="dynamic-table"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="City: activate to sort column ascending"
                      >
                        Buyer Name
                      </th>
                      <th
                        className="hidden-480 sorting p-3"
                        tabIndex="0"
                        aria-controls="dynamic-table"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="City: activate to sort column ascending"
                      >
                        Refund Amount
                      </th>
                    
                      <th
                        className="hidden-480 sorting p-3"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Status"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>
                              {" "}
                                <div className="text-center" style={{width:"100px",height:"100px"}}>
                                <img
                                   src={`${JSON.parse(item.image)[0]}`}
                                  alt="product"
                                  style={{maxWidth:"100%",height:"100px",objectFit:"contain"}}
                                />
                                </div>
                            </td>
                            <td>{item.name}</td>
                            <td>{item.firstname + " "+ item.lastname}</td>
                            <td>&#36;{item.refundable_amount}</td>
                            <td>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center">
                            No Data To Display
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              <Adminpagination
                stateData={refundproducts}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setViewRowIndex={setViewRowIndex}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </main>
          <Adminfooter />
        </div>
      </div>
    </div>
  
  </div>
  )
}

export default Refundproducts
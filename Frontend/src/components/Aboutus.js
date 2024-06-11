import React from "react";
import MyNavbar from "./navbar";
import Footer from "./footer";

export default function Aboutus() {
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <img
        src="https://cohereone.com/wp-content/uploads/2020/06/AboutUs_3.1_1950x500-1.jpg"
        alt="aboutus"
        width="100%"
        height="300px"
        style={{objectFit:"cover",backgroundPosition:'center',backgroundRepeat:'no-repeat'}}
      ></img>
        <section className="p-2 m-md-5">
          <p className="fs-6">
            <b>
              <i>Closet Bargain,</i>
            </b>{" "}
            emerged from the desire to breathe new life into unused clothing,
            fostering sustainability in the process. Recognizing the immense
            effort invested by weavers, tailors, and designers in crafting
            outfits, this platform acknowledges the swift turnover of fashion
            trends that often leave these garments barely worn.
          </p>
          <p>
            Discover the thrill of sustainable fashion with our thrift store
            clothing website, your go-to destination for curated,
            budget-friendly style. We pride ourselves on offering a diverse
            array of pre-owned garments that blend timeless charm with
            contemporary flair. From vintage gems to current fashion favorites,
            each piece in our collection is handpicked for its quality and
            character. Whether you're on the hunt for a unique statement piece
            or seeking to refresh your wardrobe sustainably, our platform
            provides a one-stop-shop for both buyers and sellers.
          </p>
          <p>
            Join our community, where fashion meets conscious living, and
            redefine your style journey through the art of resale. Embrace the
            circular fashion movement and make a statement with every purchase
            or sale on our platform – because style should be as timeless as the
            stories our clothes tell.
          </p>
          <p>
            Bargain closet envisions a platform where customers not only have
            the power to make a positive impact on the environment but also
            access fantastic deals on the latest trends, fostering a sense of
            joy and satisfaction in their shopping experience. Happy Shopping!
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

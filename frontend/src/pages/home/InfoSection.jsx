import React from 'react';

const InfoSection = ({}) => {
  return (
    <>
      <section className="info-section">
        <div className="info-why-div">
          <h2 className="info-why inline-font text-black">რატომ</h2>
          <img src="/logo.svg" alt="logo black" />
        </div>
        <div className="info-div">
          <div className="info-1">
            <h4>არამხოლოდ კომფორტული — ანატომიური</h4>
            <p>CEYO-ს ფეხსაცმელი ერგება ფეხის ბუნებრივ ფორმას</p>
          </div>
          <div className="info-2">
            <h4>ორთოპედიული ფეხსაცმელი</h4>
            <p>
              იდეალურია მგრძნობიარე ფეხებისთვის ან სამედიცინო საჭიროებების მქონე ადამიანებისთვის
            </p>
          </div>
          <div className="info-3">
            <h4>მემკვიდრეობა და ნდობა</h4>
            <p>
              ბრენდი დაარსდა 1964 წელს და წარმოდგენილია 28 ქვეყანაში, მათ შორის აშშ, დიდი ბრიტანეთი
              და არაბეთის გაერთიანებული საემიროები
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;

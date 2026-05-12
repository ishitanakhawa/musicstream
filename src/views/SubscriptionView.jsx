export default function SubscriptionView() {
  return (
    <div className="view subscription-view">
      <h1 className="view__heading">Choose Your Plan</h1>
      <p className="view__subheading">Unlock premium features and support your favorite artists.</p>
      
      <div className="subscription-grid">
        {/* Student Plan */}
        <div className="sub-card">
          <div className="sub-title">Student</div>
          <div className="sub-price">$4.99<span>/month</span></div>
          <div className="sub-desc">Perfect for students. Requires valid university ID.</div>
          <ul className="sub-features">
            <li>Ad-free listening</li>
            <li>High-quality audio</li>
            <li>Offline downloads</li>
            <li>Listen with friends</li>
          </ul>
          <button className="sub-btn">Get Student</button>
        </div>

        {/* Individual Plan */}
        <div className="sub-card sub-card--popular">
          <div className="sub-badge">Most Popular</div>
          <div className="sub-title">Individual</div>
          <div className="sub-price">$9.99<span>/month</span></div>
          <div className="sub-desc">Everything you need for an ultimate personal music experience.</div>
          <ul className="sub-features">
            <li>Ad-free listening</li>
            <li>High-quality audio</li>
            <li>Offline downloads</li>
            <li>Listen with friends</li>
            <li>Exclusive early access</li>
          </ul>
          <button className="sub-btn">Get Individual</button>
        </div>

        {/* Family Plan */}
        <div className="sub-card">
          <div className="sub-title">Family</div>
          <div className="sub-price">$14.99<span>/month</span></div>
          <div className="sub-desc">Up to 6 Premium accounts for family members under one roof.</div>
          <ul className="sub-features">
            <li>Up to 6 accounts</li>
            <li>Block explicit music</li>
            <li>Ad-free listening</li>
            <li>High-quality audio</li>
            <li>Offline downloads</li>
          </ul>
          <button className="sub-btn">Get Family</button>
        </div>
      </div>
    </div>
  );
}

export default function MapPreviewCard({ theme }) {
  return (
    <section className="pb-4">
      <div
        className="relative h-40 w-full rounded-[24px] overflow-hidden cursor-pointer group"
        onClick={() => window.open("https://windy.com", "_blank")}
        style={{ border: `1px solid ${theme.cardBorder}` }}
      >
        <img
          alt="Precipitation map preview"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4lH8BetxfG_rf6s0U1up4Mb17MaHFVeNvlj5WZdgxS8SMceKbIirWhu8_TUQMS8eo4DPM2i9YeMrAuVy9FDhBsfrQjUbU2npRr886MDTqUFflfw7IcetW01GWcZScBlKj3kY0CETArb6nBZpNjWvhv79Qb0lLe3i7-uIv1w6mmpqovPtVCGs2nYhMi97Dx2jq9o1lsdM95cncCq5Hpjl1v6DsCxp6syoErRbp1cIfhrRB9wodeoka8LtepbBGUB8XMxou-oGA3qNv"
        />
        <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex justify-between items-center w-full">
            <span className="text-white font-headline-lg-mobile text-xl">Precipitation Map</span>
            <span
              className="material-symbols-outlined text-white rounded-full p-2"
              style={{ background: theme.accentColor }}
            >
              arrow_forward
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

const SaaSComparisonSection = () => {
  return (
    <section id="saas-comparison" className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Efficiency</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-center text-[var(--foreground)]">
            Ship SaaS Fast
          </h2>
          <p className="mt-4 text-[var(--foreground)] font-inter font-medium text-base md:text-lg opacity-80">
            No need to write the SaaS wrapper code anymore, just add your idea, script, no-code tool inside and go live now
          </p>
        </div>
        <div className="flex gap-8 items-center justify-center flex-col lg:flex-row">
          {/* Left Card */}
          <div className="relative max-w-[380px] w-full min-h-[400px] pb-8 pt-6 px-6 border rounded-2xl bg-[var(--background-lighter)] scale-1.0 hover:scale-[1.02] transition-all duration-300 border-[#EA2222]">
            <div>
              <div className="text-[var(--foreground)] text-xl font-semibold mb-4">
                Software development
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 15 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  to code Auth & User Profile
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 3 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  to setup & design Email
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 8 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  to setup Stripe, Payments, Webhooks
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 4 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  adding SEO
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 12 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  to setup SEO Blog CMS
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 2 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  to build a Dashboard
                </p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="text-[#EA2222] min-w-[67px] text-center dark:text-white font-semibold !leading-[1.21] text-sm bg-[#FDE9E9] whitespace-nowrap dark:bg-[#EA2222] px-[6px] py-1 rounded-[5px]">
                  + 2 hrs
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">
                  DB setup
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 uppercase left-1/2 transform -translate-x-1/2 translate-y-1/2 font-inter w-[250px] text-center font-bold text-base py-2 px-3 rounded-lg bg-[#FDE9E9] text-[#EA2222] dark:text-white dark:bg-[#EA2222]">
              = 55 hours of PROBLEMS
            </div>
          </div>

            {/* VS Separator Images */}
            <img alt="vs" loading="lazy" width="134" height="350" className="h-[350px] hidden lg:block" style={{color:'transparent'}} src="/vs.svg" />
            <img alt="vs" loading="lazy" width="134" height="350" className="h-[170px] block lg:hidden mt-4" style={{color:'transparent'}} src="/vs.svg" />
          
          {/* Right Card */}
          <div className="relative max-w-[380px] w-full min-h-[400px] pb-8 pt-6 px-6 border rounded-2xl bg-[var(--background-lighter)] scale-1.0 hover:scale-[1.02] transition-all duration-300 border-[#1AAB12]">
            <div>
              <div className="text-[var(--foreground)] text-xl font-semibold mb-4">
                <div className="flex items-center gap-1">
                  {/* Assuming logo is in public/assets */}
                  <img alt="logo" width="24" height="24" style={{color:'transparent'}} src="/assets/logo.svg" /> {/* Ensure this asset exists in public/assets/ */}
                  <div className="flex gap-1 items-center">
                    <p className="text-[var(--foreground)] text-[20px] leading-[20px] font-semibold">MicroSaas</p>
                    <p className="text-white dark:text-black1 bg-black dark:bg-white font-semibold px-2 rounded-[3px] pb-[3px] pt-[2px] text-[20px] leading-[20px]">Fast</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Auth & User Profile</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Email setup & design</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Landing Page & UI</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Stripe, Payments, Webhooks</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">SEO</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">SEO Blog CMS</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">Dashboard</p>
              </div>
              <div className="flex gap-2 items-start justify-start mb-3">
                <div className="mt-[1px]">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8924 18.7292C15.4847 18.7292 19.2076 15.0063 19.2076 10.414C19.2076 5.8216 15.4847 2.09875 10.8924 2.09875C6.3 2.09875 2.57715 5.8216 2.57715 10.414C2.57715 15.0063 6.3 18.7292 10.8924 18.7292Z" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.39746 10.4133L10.0605 12.0763L13.3866 8.75024" stroke="#1AAB12" strokeWidth="1.66304" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-[var(--foreground)] font-medium font-inter text-base !leading-[1.37]">DB setup</p>
              </div>
            </div>
            <div className="absolute bottom-0 uppercase left-1/2 transform -translate-x-1/2 translate-y-1/2 font-inter w-[250px] text-center font-bold text-base py-2 px-3 rounded-lg bg-[#1AAB12] text-white">
              = 17 min Setup
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaaSComparisonSection;

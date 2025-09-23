import { useState } from "react";
import { ArrowLeft, ArrowRight, Upload, User, School, CreditCard, Check } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    dateOfBirth: "",
    gender: "",
    photo: null,
    
    // Step 2
    schoolName: "",
    regionGroup: "",
    category: "",
    grade: "",
    
    // Step 3
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    emergencyContact: "",
    referralCode: "",
    promoCode: "",
    acceptTerms: false
  });

  const categories = [
    "Lower Primary (Primary 1-3)",
    "Upper Primary (Primary 4-6)", 
    "JSS (Junior Secondary 1-3)",
    "SSS (Senior Secondary 1-3)"
  ];

  const regions = [
    "Southwest",
    "South-South & Southeast",
    "North Central", 
    "Northwest",
    "Northeast"
  ];

  const schools = [
    "Kings College Lagos",
    "Queens College Lagos",
    "Government College Ibadan",
    "Federal Government College Kaduna",
    "Enter custom school name..."
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Participant Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
          <div className="flex gap-4">
            {['Male', 'Female', 'Other'].map(gender => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-foreground text-sm">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Upload Photo (1:1 ratio, max 2MB)</label>
          <div className="border-2 border-dashed border-white/20 rounded-base p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
            <GlassButton variant="ghost" size="sm">Choose File</GlassButton>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <School className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">School & Category</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">School Name *</label>
          <select
            value={formData.schoolName}
            onChange={(e) => handleInputChange('schoolName', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select your school</option>
            {schools.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Region Group *</label>
          <select
            value={formData.regionGroup}
            onChange={(e) => handleInputChange('regionGroup', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select region</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Grade/Class</label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            placeholder="e.g., Primary 5, JSS 2, SSS 1"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Parent Info & Payment</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Parent/Guardian Name *</label>
            <input
              type="text"
              value={formData.parentName}
              onChange={(e) => handleInputChange('parentName', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Parent/Guardian full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Parent Phone *</label>
            <input
              type="tel"
              value={formData.parentPhone}
              onChange={(e) => handleInputChange('parentPhone', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Parent Email *</label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => handleInputChange('parentEmail', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Emergency Contact</label>
            <input
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Emergency contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Referral Code</label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => handleInputChange('referralCode', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Optional referral code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Promo/Discount Code</label>
            <input
              type="text"
              value={formData.promoCode}
              onChange={(e) => handleInputChange('promoCode', e.target.value)}
              className="w-full glass-card px-4 py-3 rounded-base border border-white/10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Optional promo code"
            />
          </div>
        </div>

        <div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Fee Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-foreground">₦15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-success">-₦0</span>
              </div>
              <hr className="border-white/10" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₦15,000</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I accept the terms & conditions and photo release agreement for competition participation and promotional materials.
                </span>
              </label>
            </div>

            <GlassButton 
              variant="accent" 
              size="lg" 
              className="w-full mt-6"
              disabled={!formData.acceptTerms}
            >
              Pay ₦15,000
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'
                  }`}>
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <GlassCard className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {currentStep > 1 ? (
                <GlassButton variant="ghost" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </GlassButton>
              ) : <div />}

              {currentStep < 3 && (
                <GlassButton variant="primary" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </GlassButton>
              )}
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
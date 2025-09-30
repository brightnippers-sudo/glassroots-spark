import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  User,
  School,
  Phone,
  Heart,
  Trophy,
  Save,
  X,
  Loader2,
  Check
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Phone: allow empty string OR a validated phone string
const phoneSchema = z.union([
  z.literal(''),
  z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\s-]*$/, "Invalid phone number format")
]);

// Profile form schema with validation (added email & referralCode)
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  school: z.string().min(3, "School name must be at least 3 characters").max(100, "School name too long"),
  grade: z.string().min(1, "Please select your grade"),
  phone: phoneSchema,
  email: z.string().email("Invalid email address").optional(),
  referralCode: z.string().optional(),
  interests: z.string().optional(),
  achievements: z.string().optional(),
  role: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  // currentProfile may come in snake_case from API or camelCase from transformers
  currentProfile: Record<string, any>;
  onSave: (data: ProfileFormData & { photo?: File }) => Promise<void>;
}

const ProfileEditor = ({ isOpen, onClose, currentProfile, onSave }: ProfileEditorProps) => {
  // helper to fetch value from either camelCase or snake_case keys
  const getProfileValue = (obj: Record<string, any>, camelKey: string, snakeKey?: string) => {
    const sk = snakeKey ?? camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (obj == null) return '';
    return obj[camelKey] ?? obj[sk] ?? obj[snakeKey ?? sk] ?? '';
  };

  const [profilePhoto, setProfilePhoto] = useState<string>(getProfileValue(currentProfile, 'photo_url', 'photo_url') || '/placeholder-avatar.jpg');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: getProfileValue(currentProfile, 'firstName', 'first_name'),
      lastName: getProfileValue(currentProfile, 'lastName', 'last_name'),
      school: getProfileValue(currentProfile, 'school', 'school'),
      grade: getProfileValue(currentProfile, 'grade', 'grade'),
      phone: (getProfileValue(currentProfile, 'phone', 'phone') as string) || '',
      email: (getProfileValue(currentProfile, 'email', 'email') as string) || '',
      referralCode: (getProfileValue(currentProfile, 'referralCode', 'referral_code') as string) || '',
      interests: getProfileValue(currentProfile, 'interests', 'interests'),
      achievements: getProfileValue(currentProfile, 'achievements', 'achievements')
    }
  });

  // Update form when currentProfile changes
  useEffect(() => {
    console.log('Current Profile Data:', {
      currentProfile,
      formValues: form.getValues()
    });

    form.reset({
      firstName: getProfileValue(currentProfile, 'firstName', 'first_name'),
      lastName: getProfileValue(currentProfile, 'lastName', 'last_name'),
      school: getProfileValue(currentProfile, 'school', 'school'),
      grade: getProfileValue(currentProfile, 'grade', 'grade'),
      phone: (getProfileValue(currentProfile, 'phone', 'phone') as string) || '',
      email: (getProfileValue(currentProfile, 'email', 'email') as string) || '',
      referralCode: (getProfileValue(currentProfile, 'referralCode', 'referral_code') as string) || '',
      interests: getProfileValue(currentProfile, 'interests', 'interests'),
      achievements: getProfileValue(currentProfile, 'achievements', 'achievements')
    });

    // keep profile photo in sync if provided
    const photo = getProfileValue(currentProfile, 'photo_url', 'photo_url') || getProfileValue(currentProfile, 'photo', 'photo');
    if (photo) setProfilePhoto(photo);
  }, [currentProfile]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePhoto(previewUrl);
      setPhotoFile(file);

      toast({
        title: "Photo selected",
        description: "Your new profile photo will be saved when you submit the form",
        variant: "default"
      });
    } catch (error) {
      console.error('Error handling photo:', error);
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      console.log('Form data before save:', data);
      await onSave({ ...data, photo: photoFile || undefined });
      setShowSuccess(true);

      // Show success state briefly then close
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        toast({
          title: "Profile updated successfully!",
          description: "Your changes have been saved",
          variant: "default"
        });
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty || photoFile) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmClose) return;
    }

    // Reset form and photo
    form.reset();
    setProfilePhoto(getProfileValue(currentProfile, 'photo_url', 'photo_url') || '/placeholder-avatar.jpg');
    setPhotoFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="p-8 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Edit Your Profile</h2>
              <p className="text-muted-foreground mt-1">Update your information and make it shine ✨</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full glass-card border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                ) : (
                  <Camera className="w-4 h-4 text-foreground" />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <p className="text-sm text-muted-foreground mt-3 text-center">
              Click the camera icon to change your photo
              <br />
              <span className="text-xs opacity-75">Max 5MB • JPG, PNG, GIF</span>
            </p>
          </div>

          {/* Membership Tier */}
          <div className="flex justify-center mb-8">
            <Badge className="bg-secondary-orange/20 text-secondary-orange px-4 py-2 text-sm font-medium">
              <Trophy className="w-4 h-4 mr-2" />
              {getProfileValue(currentProfile, 'tier', 'tier') || 'Basic'} Member
            </Badge>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your first name"
                            className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your last name"
                            className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground flex items-center gap-2">
                        <School className="w-4 h-4" />
                        School
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your school name"
                          className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Grade/Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300">
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primary-1">Primary 1</SelectItem>
                          <SelectItem value="primary-2">Primary 2</SelectItem>
                          <SelectItem value="primary-3">Primary 3</SelectItem>
                          <SelectItem value="primary-4">Primary 4</SelectItem>
                          <SelectItem value="primary-5">Primary 5</SelectItem>
                          <SelectItem value="primary-6">Primary 6</SelectItem>
                          <SelectItem value="jss-1">JSS 1</SelectItem>
                          <SelectItem value="jss-2">JSS 2</SelectItem>
                          <SelectItem value="jss-3">JSS 3</SelectItem>
                          <SelectItem value="ss-1">SS 1</SelectItem>
                          <SelectItem value="ss-2">SS 2</SelectItem>
                          <SelectItem value="ss-3">SS 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    // debug: shows what the field currently has
                    console.log('Phone field value:', field.value);
                    return (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+234 xxx xxx xxxx"
                            className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Referral code (editable) */}
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Referral Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"Visit your Profile > Invite Friends on quiz.10mytt.com to get Refferal Code."}
                          className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              {/* Optional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Additional Details
                  <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                </h3>

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Interests & Hobbies</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us about your interests, hobbies, and what you love doing..."
                          className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300 min-h-[80px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Achievements & Awards
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Share your achievements, awards, or any accomplishments you're proud of..."
                          className="glass-card border-white/10 focus:border-primary/50 transition-all duration-300 min-h-[80px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <GlassButton
                  type="submit"
                  variant="primary"
                  disabled={isSaving || showSuccess}
                  className="flex-1 transition-all duration-300 hover:scale-[1.02]"
                >
                  {showSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved Successfully!
                    </>
                  ) : isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </GlassButton>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving || showSuccess}
                  className="flex-1 transition-all duration-300 hover:scale-[1.02]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfileEditor;

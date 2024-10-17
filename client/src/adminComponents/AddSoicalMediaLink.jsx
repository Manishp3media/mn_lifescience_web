import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CustomSpinner from "./CustomSpinner";
import { addSocialMediaLink, updateSocialMediaLink, fetchSocialMediaLinks } from "@/redux/socialMediaSlice";

function UpdatedSocialMediaLinkForm({ isSocialMediaLinkOpen, onSocialMediaLinkClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const socialMediaLinks = useSelector(state => state.socialMediaLink);

  useEffect(() => {
    dispatch(fetchSocialMediaLinks());
  }, [dispatch]);

  const predefinedPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];

  const formik = useFormik({
    initialValues: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
    validationSchema: Yup.object().shape({
      facebook: Yup.string().optional(),
      instagram: Yup.string().optional(),
      twitter: Yup.string().optional(),
      linkedin: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const allFields = [...predefinedPlatforms, ...customFields.map(f => f.platform)];
        for (const platform of allFields) {
          if (values[platform]) {  // Only submit fields with values
            const linkData = { platform, url: values[platform] };
            const existingLink = socialMediaLinks?.find(link => link.platform === platform);
            if (existingLink) {
              await dispatch(updateSocialMediaLink({ id: existingLink._id, ...linkData })).unwrap();
            } else {
              await dispatch(addSocialMediaLink(linkData)).unwrap();
            }
          }
        }
        toast.success("Social media links updated successfully");
        onSocialMediaLinkClose();
      } catch (error) {
        toast.error(error.message || 'Failed to update social media links');
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  

  useEffect(() => {
    if (socialMediaLinks?.length > 0) {
      const newValues = { ...formik.values };
      socialMediaLinks.forEach(link => {
        if (predefinedPlatforms.includes(link.platform)) {
          newValues[link.platform] = link.url;
        } else {
          setCustomFields(prev => [...prev.filter(f => f.platform !== link.platform), { platform: link.platform, url: link.url }]);
          newValues[link.platform] = link.url;
        }
      });
      formik.setValues(newValues);
    }
  }, [socialMediaLinks]);

  const addCustomField = () => {
    setCustomFields([...customFields, { platform: '', url: '' }]);
  };

  const removeCustomField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
  };

  return (
    <Dialog open={isSocialMediaLinkOpen} onOpenChange={onSocialMediaLinkClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Social Media Links</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="predefined">
              <AccordionTrigger>Predefined Platforms</AccordionTrigger>
              <AccordionContent>
                {predefinedPlatforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2 mb-2">
                    <Input
                      name={platform}
                      value={formik.values[platform]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={`Enter ${platform} URL`}
                    />
                    {formik.touched[platform] && formik.errors[platform] && (
                      <div className="text-red-500">{formik.errors[platform]}</div>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom">
              <AccordionTrigger>Custom Platforms</AccordionTrigger>
              <AccordionContent>
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      name={`customPlatform${index}`}
                      value={field.platform}
                      onChange={(e) => {
                        const updatedFields = [...customFields];
                        updatedFields[index].platform = e.target.value;
                        setCustomFields(updatedFields);
                      }}
                      placeholder="Enter platform name"
                    />
                    <Input
                      name={field.platform}
                      value={formik.values[field.platform] || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter URL"
                    />
                    <Button type="button" onClick={() => removeCustomField(index)} className="bg-red-500 hover:bg-red-600">
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addCustomField} className="mt-2">
                  Add Custom Platform
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isSubmitting}>
              {isSubmitting ? <CustomSpinner size={20} /> : "Save Changes"}
            </Button>
            <Button className="hover:bg-red-500" onClick={onSocialMediaLinkClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatedSocialMediaLinkForm;
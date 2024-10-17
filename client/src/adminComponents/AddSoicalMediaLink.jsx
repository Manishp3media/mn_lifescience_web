import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { addSocialMediaLink, fetchSocialMediaLinks, updateSocialMediaLink } from "@/redux/socialMediaSlice";

const AddSocialMediaLink = ({ isSocialMediaLinkOpen, onSocialMediaLinkClose }) => {
  const dispatch = useDispatch();
  const { socialMediaLinks, loading } = useSelector((state) => state.sociaLMediaLink);

  // State to manage social media link inputs
  const [platformLinks, setPlatformLinks] = useState([{ platform: "", link: "" }]);
  const [editing, setEditing] = useState(false); // Track if in editing mode

  useEffect(() => {
    // Fetch the existing social media links when component mounts
    dispatch(fetchSocialMediaLinks());
  }, [dispatch]);

  // Function to handle adding new input fields for more platforms
  const handleAddPlatform = () => {
    setPlatformLinks([...platformLinks, { platform: "", link: "" }]);
  };

  // Function to handle input change
  const handleInputChange = (index, field, value) => {
    const updatedLinks = [...platformLinks];
    updatedLinks[index][field] = value;
    setPlatformLinks(updatedLinks);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    const existingPlatform = socialMediaLinks.find(
      (link) => platformLinks[0].platform === link.platform
    );
    if (existingPlatform) {
      // If platform exists, dispatch update action
      dispatch(updateSocialMediaLink({ ...existingPlatform, ...platformLinks[0] }));
    } else {
      // If platform doesn't exist, dispatch add action
      dispatch(addSocialMediaLink(platformLinks));
    }
    onSocialMediaLinkClose(); // Close form modal after submission
  };

  // Pre-fill data if editing
  const handleEdit = (link) => {
    setEditing(true);
    setPlatformLinks([{ platform: link.platform, link: link.link }]);
  };

  return (
    <Dialog open={isSocialMediaLinkOpen} onOpenChange={onSocialMediaLinkClose}>
      <DialogTrigger asChild>
        {/* This trigger can be a button or any element to open the dialog */}
        <button className="btn-open-dialog">Add Social Media Link</button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <h3>{editing ? "Edit Social Media Link" : "Add Social Media Link"}</h3>
        </DialogHeader>

        {platformLinks.map((platformLink, index) => (
          <div key={index} className="platform-input-group">
            <input
              type="text"
              placeholder="Platform"
              value={platformLink.platform}
              onChange={(e) => handleInputChange(index, "platform", e.target.value)}
              disabled={editing} // Disable platform input when editing
              className="input-field"
            />
            <input
              type="text"
              placeholder="Link"
              value={platformLink.link}
              onChange={(e) => handleInputChange(index, "link", e.target.value)}
              className="input-field"
            />
            {!editing && (
              <button type="button" onClick={handleAddPlatform} className="add-platform-btn">
                Add Platform
              </button>
            )}
          </div>
        ))}

        <DialogFooter>
          <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
            {editing ? "Update Link" : "Add Link"}
          </button>
          <DialogClose asChild>
            <button className="cancel-btn">Cancel</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSocialMediaLink;

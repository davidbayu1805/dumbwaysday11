import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import ProjectService from "../services/pojectServices.js";

const techIcons = {
  "React Js": "ri-reactjs-line",
  "Next Js": "ri-nextjs-line",
  "Node Js": "ri-nodejs-line",
  "TypeScript": "ri-code-s-slash-line",
};

const MyProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    project_name: "",
    start_date: "",
    end_date: "",
    description: "",
    technologies: [],
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectService.getAllProjects();
      if (response.success) {
        const transformedProjects = response.data.map(project => ({
          ...project,
          name: project.project_name,
          startDate: project.start_date,
          endDate: project.end_date,
          imagePreview: project.image || null,
          duration: getDuration(project.start_date, project.end_date),
          year: project.start_date ? new Date(project.start_date).getFullYear() : 'N/A',
        }));
        setProjects(transformedProjects);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load projects: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        technologies: checked
          ? [...prev.technologies, value]
          : prev.technologies.filter(t => t !== value)
      }));
    } else if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        try {
          // Validate file type
          if (!file.type.match('image.*')) {
            throw new Error('Only image files are allowed (JPEG, PNG, etc.)');
          }

          // Validate file size (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
            throw new Error('File size must be less than 2MB');
          }

          const base64 = await ProjectService.fileToBase64(file);
          setForm(prev => ({ 
            ...prev, 
            image: base64
          }));
        } catch (error) {
          console.error('Error processing file:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: error.message,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name === "name" ? "project_name" : 
         name === "startDate" ? "start_date" :
         name === "endDate" ? "end_date" : name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.project_name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Project name is required!',
      });
      return;
    }

    try {
      setLoading(true);
      
      const projectData = {
        project_name: form.project_name,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description || null,
        technologies: form.technologies,
        image: form.image, // Send the full base64 data URL
      };

      const response = await ProjectService.createProject(projectData);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Project created successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        
        // Reset form
        setForm({
          project_name: "",
          start_date: "",
          end_date: "",
          description: "",
          technologies: [],
          image: null,
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        await loadProjects();
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create project: ' + (error.response?.data?.message || error.message || 'Unknown error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const getDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  const handleEdit = (index) => {
    const project = projects[index];

    Swal.fire({
      title: "Edit Project",
      width: "42rem",
      html: `
      <div class="grid gap-4 text-left text-sm text-gray-700">
        <div>
          <label class="block mb-2 font-semibold" for="swal-name">Project Name</label>
          <input id="swal-name" type="text" value="${project.name || ''}" placeholder="Project Name"
            class="swal2-input bg-white rounded-lg px-4 py-2 shadow-none !w-full ml-auto" style="margin-left:0px; box-shadow:none;"/>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2">
            <label class="block mb-2 font-semibold text-left" for="swal-start">Start Date</label>
            <input
              id="swal-start"
              type="date"
              value="${project.startDate || ''}"
              class="swal2-input bg-white rounded-lg px-4 py-2 shadow-none !w-full" style="margin-left:auto" style="margin-left:0px; box-shadow:none;"
            />
          </div>
          <div class="w-full sm:w-1/2">
            <label class="block mb-2 font-semibold text-left" for="swal-end">End Date</label>
            <input
              id="swal-end"
              type="date"
              value="${project.endDate || ''}"
              class="swal2-input bg-white rounded-lg px-4 py-2 shadow-none !w-full" style="margin-left:auto" style="margin-left:0px; box-shadow:none;"
            />
          </div>
        </div>

        <div>
          <label class="block mb-2 font-semibold" for="swal-desc">Description</label>
          <textarea id="swal-desc" rows="4" placeholder="Description"
            class="swal2-textarea bg-white rounded-lg px-4 py-2 shadow-none !w-full resize-none ml-auto" style="margin-left:0px; box-shadow:none;">${
              project.description || ''
            }</textarea>
        </div>

        <div>
          <label class="block mb-2 font-semibold">Technologies</label>
          <div class="grid grid-cols-2 gap-2">
            ${["React Js", "Next Js", "Node Js", "TypeScript"]
              .map(
                (tech) => `
                <label class="flex items-center">
                  <input type="checkbox" class="swal-tech mr-2" value="${tech}" 
                    ${(project.technologies || []).includes(tech) ? "checked" : ""} />
                  ${tech}
                </label>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      customClass: {
        confirmButton: "bg-black text-white rounded-full px-6 py-2",
        cancelButton: "bg-gray-200 text-black rounded-full px-6 py-2 ml-2",
      },
      preConfirm: async () => {
        try {
          const projectName = document.getElementById("swal-name").value.trim();
          const startDate = document.getElementById("swal-start").value;
          const endDate = document.getElementById("swal-end").value;
          const description = document.getElementById("swal-desc").value.trim();
          
          const checkedTechs = Array.from(
            document.querySelectorAll(".swal-tech:checked")
          ).map((el) => el.value);

          if (!projectName) {
            Swal.showValidationMessage('Project name is required');
            return false;
          }

          const updatedData = {
            project_name: projectName,
            start_date: startDate || null,
            end_date: endDate || null,
            description: description || null,
            technologies: checkedTechs,
            image: project.image || null,
          };

          const response = await ProjectService.updateProject(project.id, updatedData);
          
          if (response.success) {
            return true;
          } else {
            throw new Error(response.message || 'Update failed');
          }
        } catch (error) {
          console.error('Update error:', error);
          Swal.showValidationMessage(`Update failed: ${error.message}`);
          return false;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Project updated successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        await loadProjects();
      }
    });
  };

  const handleDelete = (index) => {
    const project = projects[index];
    
    Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "grey",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await ProjectService.deleteProject(project.id);
          
          if (response.success) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Project has been deleted",
              timer: 1500,
              showConfirmButton: false,
            });
            await loadProjects();
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete project: ' + error.message,
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleCardClick = (project) => {
    Swal.fire({
      title: `<strong style="font-size: 20px;">${project.name}</strong>`,
      html: `
      <div class="swal-flex-container" style="display: flex; gap: 16px; align-items: flex-start;">
        ${project.imagePreview ? `
          <img 
            src="${project.imagePreview}" 
            class="swal-flex-image"
            style="width: 250px; height: auto; border-radius: 8px; object-fit: cover; margin-top: 4px;"
          />
        ` : '<div class="swal-flex-image" style="width: 250px; height: 150px; background-color: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>'}
        
        <div class="swal-flex-content" style="text-align: left; font-size: 10px; padding-top: 4px; flex: 1; margin-left: 8px;">
          <p style="margin-bottom: 4px; font-weight: 600;">Duration</p>
          <p style="margin-bottom: 4px;">
            <i class="ri-calendar-todo-line"></i> ${project.startDate || 'N/A'} - ${
        project.endDate || 'N/A'
      }
          </p>
          <p style="margin-bottom: 10px;">
            <i class="ri-time-zone-line"></i> ${project.duration}
          </p>
          <p style="margin-bottom: 6px; font-weight: 600;">Technologies</p>
          <div style="display: flex; flex-wrap: wrap; column-gap: 20px; row-gap: 8px;">
            ${(project.technologies || [])
              .map(
                (tech) => `
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; min-height: 24px;">
                      <i class="${techIcons[tech] || 'ri-code-line'}" style="font-size: 14px;"></i> ${tech}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; max-height: 200px; overflow-y: auto; text-align: justify; font-size: 14px;">
        ${project.description || 'No description available.'}
      </div>
    `,
      customClass: {
        popup: "rounded-lg text-left",
      },
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
    });
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl flex items-center">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 sm:px-8 md:px-12 overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl mt-24 font-bold text-center mb-6 sm:mb-8">
          ADD MY PROJECT
        </h2>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid gap-4">
          <div>
            <label
              className="block mb-2 text-gray-700 font-semibold"
              htmlFor="name"
            >
              Project Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Project Name"
              value={form.project_name}
              onChange={handleChange}
              className="bg-white rounded-lg px-4 py-2 shadow w-full"
              required
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="block mb-2 text-gray-700 font-semibold"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="bg-white rounded-lg px-4 py-2 shadow w-full"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="block mb-2 text-gray-700 font-semibold"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange}
                  className="bg-white rounded-lg px-4 py-2 shadow w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className="block mb-2 text-gray-700 font-semibold"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="bg-white rounded-lg px-4 py-2 shadow resize-none w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Technologies
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["React Js", "Next Js", "Node Js", "TypeScript"].map((tech) => (
                <label key={tech} className="flex items-center">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={form.technologies.includes(tech)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {tech}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Upload Image
            </label>
            <div
              className="flex justify-between items-center bg-white px-4 py-2 rounded-md shadow-md cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm truncate max-w-[70%]">
                {form.image ? "Image selected" : "Click to upload image"}
              </span>
              <i className="ri-image-add-line text-xl text-gray-500 hover:text-black transition ml-4" />
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
            {form.image && (
              <div className="mt-2 text-sm text-gray-500">
                <i className="ri-check-line text-green-500 mr-1"></i>
                Image ready to upload (max 2MB)
              </div>
            )}
          </div>

          <div className="flex justify-end mb-10">
            <button
              type="submit"
              disabled={loading}
              className={`bg-black text-white rounded-full px-6 py-2 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full bg-white pt-5 pb-12 px-2 sm:px-4">
        <h3 className="text-2xl font-semibold mb-6 text-center">MY PROJECT</h3>
        {projects.length === 0 ? (
          <div className="text-center text-gray-500">
            No projects found. Create your first project above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {projects.map((p, idx) => (
              <div
                key={p.id || idx}
                className="bg-white rounded-xl shadow-md p-4 w-full max-w-xs cursor-pointer hover:shadow-xl transition duration-300"
                onClick={() => handleCardClick(p)}
              >
                {p.imagePreview && (
                  <img
                    src={p.imagePreview}
                    alt="project"
                    className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-bold text-sm sm:text-base">
                  {p.name} - {p.year}
                </h4>
                <p className="text-sm">Duration: {p.duration}</p>
                <p className="text-sm mt-2 line-clamp-3">{p.description}</p>

                <div className="flex gap-3 text-xl mt-3 text-black">
                  {(p.technologies || []).slice(0, 3).map((tech, techIdx) => (
                    <i key={techIdx} className={techIcons[tech] || "ri-code-line"} />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[5px] mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(idx);
                    }}
                    disabled={loading}
                    className="bg-gray-900 text-white text-sm px-4 py-1 rounded hover:bg-black w-full sm:w-1/2 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(idx);
                    }} 
                    disabled={loading}
                    className="bg-gray-900 text-white text-sm px-4 py-1 rounded hover:bg-black w-full sm:w-1/2 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyProject;
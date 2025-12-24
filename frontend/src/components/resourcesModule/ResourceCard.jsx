import React from "react";
import {
  FileText,
  Download,
  BookOpen,
  FileImage,
  FileCode,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export const ResourceCard = ({ resource, onDelete }) => {
  const { isLoggedIn, role, loading: authLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-500" />;
      case "jpg":
      case "png":
      case "gif":
        return <FileImage className="h-6 w-6 text-purple-500" />;
      case "zip":
      case "rar":
        return <FileCode className="h-6 w-6 text-gray-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-teal-500" />;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(
        `${API}/api/v1/resources/delete/${resource.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Event deleted successfully!");
        if (onDelete) onDelete();
      } else {
        alert(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Something went wrong while deleting the event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start">
          <div className="p-2 rounded-md bg-blue-50">
            {getFileIcon(resource.fileType)}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {resource.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {resource.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <User className="h-4 w-4 mr-1" />
            <span>{resource.uploader}</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {resource.category}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between items-center gap-2">
        <span className="text-xs text-gray-500">{resource.fileSize}</span>

        <button
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => window.open(resource.fileUrl, "_blank")}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </button>

        {!authLoading && isLoggedIn && role === "ADMIN" && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};

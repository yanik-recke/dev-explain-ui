"use client";

import { useState } from "react";
import { ChevronRight, Globe, List, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useIdStore } from "@/stores/idStore";
import { useCommitStore } from "@/stores/commitStore";
import { Commit } from "@/stores/commitStore";

interface SelectionOption {
  id: string;
  name: string;
  value: string;
  commits: Commit[];
}

export default function SelectionView() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState<SelectionOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [hasLoadedOptions, setHasLoadedOptions] = useState(false);
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [isSubmittingDropdown, setIsSubmittingDropdown] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [dropdownError, setDropdownError] = useState("");
  const { setId, id } = useIdStore();
  const { setCommits, commits } = useCommitStore();

  const loadOptions = async () => {
    if (hasLoadedOptions) return;

    setIsLoadingOptions(true);
    await axios
      .get("http://localhost:3001/api/repos/repos")
      .then((res) => {
        if (res.status === 200) {
          setOptions(res.data);
          console.log(res.data);
          setHasLoadedOptions(true);
        }
      })
      .catch((ex) => {
        console.error("Failed to load options:", ex);
      });

    setIsLoadingOptions(false);
  };

  const validateUrl = async (urlToValidate: string): Promise<boolean> => {
    return await axios
      .post("http://localhost:3001/api/repos/repo", { url: urlToValidate })
      .then((res) => {
        if (res.status === 200) {
          setId(res.data.id);

          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  const validateProject = async (projectValue: string): Promise<boolean> => {
    // Simulate API validation with random success/failure
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate 80% success rate
    const isValid = Math.random() > 0.2;
    return isValid;
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) return;
    setIsSubmittingUrl(true);
    setUrlError("");

    try {
      const isValid = await validateUrl(url);

      if (isValid) {
        // Navigate to chat view with URL parameter
        router.push(`/chat?selection=${encodeURIComponent(url)}&type=url`);
      } else {
        setUrlError("The URL is not available or cannot be accessed");
      }
    } catch (error) {
      setUrlError("Failed to validate URL. Please try again.");
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  const handleDropdownSubmit = async () => {
    if (!selectedOption) return;

    setIsSubmittingDropdown(true);
    setDropdownError("");

    try {
      const isValid = await validateProject(selectedOption);

      if (isValid) {
        const option = options.find((opt) => opt.value === selectedOption);
        const selectionName = option?.name || selectedOption;

        if (!option) {
          setDropdownError("The selected project is not available");
        } else {
          setId(option.id);
          setCommits([...option.commits]);
          // Navigate to chat view with dropdown selection parameter
          router.push(
            `/chat?selection=${encodeURIComponent(selectionName)}&type=dropdown`
          );
        }
      } else {
        setDropdownError("The selected project is not available");
      }
    } catch (error) {
      setDropdownError("Failed to validate project. Please try again.");
    } finally {
      setIsSubmittingDropdown(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Get Started
          </h1>
          <p className="text-gray-600">
            Provide a new repository or choose an existing one
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* URL Input Option */}
          <Card className="p-6 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Enter URL</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Provide a URL to get started with your analysis
            </p>
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError("");
                }}
                className="w-full"
                disabled={isSubmittingUrl}
              />
              {urlError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{urlError}</span>
                </div>
              )}
              <Button
                onClick={handleUrlSubmit}
                disabled={!url.trim() || isSubmittingUrl}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isSubmittingUrl ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating URL...
                  </>
                ) : (
                  <>
                    Continue with URL
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Dropdown Selection Option */}
          <Card className="p-6 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <List className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Select Repository
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Choose from your existing repositories
            </p>
            <div className="space-y-3">
              <Select
                value={selectedOption}
                onValueChange={(value) => {
                  setSelectedOption(value);
                  setDropdownError("");
                }}
                onOpenChange={(open) => {
                  if (open) loadOptions();
                }}
                disabled={isSubmittingDropdown}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingOptions ? "Loading..." : "Select a project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dropdownError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{dropdownError}</span>
                </div>
              )}
              <Button
                onClick={handleDropdownSubmit}
                disabled={
                  !selectedOption || isLoadingOptions || isSubmittingDropdown
                }
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isSubmittingDropdown ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating Project...
                  </>
                ) : (
                  <>
                    Continue with Project
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

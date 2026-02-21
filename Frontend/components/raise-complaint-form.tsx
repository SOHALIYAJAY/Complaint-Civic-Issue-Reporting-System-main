'use client'


import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { MapPin, Upload, X, AlertCircle, Play } from 'lucide-react'

const ComplaintMap = dynamic(() => import('./complaint-map'), { ssr: false })

const categories = [
  'Roads & Infrastructure',
  'Water Supply',
  'Sanitation',
  'Street Lighting',
  'Drainage',
  'Illegal Construction',
  'Noise Pollution',
  'Other',
]

const districts = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Amreli']

export default function RaiseComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    Category: '',
    Description: '',
    location_address: '',
    location_District: '',
    location_taluk: '',
    ward: '',
    priority_level: 'medium',
    latitude: 0,
    longitude: 0,
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fileError, setFileError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFilesSelected(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFilesSelected(files)
    }
  }

  const handleFilesSelected = (newFiles: File[]) => {
    setFileError('')
    const validFiles: File[] = []
    const newPreviews: { url: string; type: 'image' | 'video'; name: string }[] = []

    for (const file of newFiles) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError(`File "${file.name}" is too large (max 10MB)`)
        continue
      }

      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setFileError(`File "${file.name}" is not an image or video`)
        continue
      }

      // Check total files
      if (uploadedFiles.length + validFiles.length >= 3) {
        setFileError('You can upload maximum 3 files')
        break
      }

      validFiles.push(file)

      // Generate preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const type = file.type.startsWith('image/') ? 'image' : 'video'
        newPreviews.push({
          url: event.target?.result as string,
          type,
          name: file.name,
        })
        setFilePreviews((prev) => [...prev, { url: event.target?.result as string, type, name: file.name }])
      }
      reader.readAsDataURL(file)
    }

    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 3))
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const fetchAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const address = data.address?.road
        ? `${data.address.road}, ${data.address.city || data.address.town || ''}`
        : `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      return address
    } catch (error) {
      console.error('Error getting address:', error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location_address: address || prev.location_address,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.Category || !formData.Description || !formData.location_address || !formData.location_District || !formData.location_taluk) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // Prepare data for backend - only send fields that exist in Django model
      const submitData = {
        title: formData.title,
        Category: formData.Category,
        Description: formData.Description,
        location_address: formData.location_address,
        location_District: formData.location_District,
        location_taluk: formData.location_taluk,
        priority_level: formData.priority_level.charAt(0).toUpperCase() + formData.priority_level.slice(1), // Capitalize: 'medium' -> 'Medium'
        status: 'Pending' // Default status
      }

      console.log('Submitting data:', submitData)

      const response = await fetch("http://127.0.0.1:8000/api/raisecomplaint/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData) 
      })

      const data = await response.json()
      console.log('Server response:', data)

      if (!response.ok) {
        console.error('Server error:', data)
        throw new Error(data.errors ? JSON.stringify(data.errors) : `HTTP error! status: ${response.status}`)
      }

      console.log("Complaint submitted successfully:", data)
      setSubmitted(true)
      alert("Complaint Submitted Successfully!")
      
      // Reset form
      setFormData({
        title: '',
        Category: '',
        Description: '',
        location_address: '',
        location_District: '',
        location_taluk: '',
        ward: '',
        priority_level: 'medium',
        latitude: 0,
        longitude: 0,
      })
      setUploadedFiles([])
      setFilePreviews([])
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert(`Error submitting complaint: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }


  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {submitted && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg slide-in-up">
            <div className="flex gap-4 items-start">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-1">Complaint Submitted Successfully!</h3>
                <p className="text-green-600 text-sm">Your complaint ID: <span className="font-mono font-bold">CTC-2024-001234</span></p>
                <p className="text-green-600 text-sm mt-2">We will review your complaint and take necessary action. You can track the status using your complaint ID.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" >
              {/* Complaint Title */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Category */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the issue..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Attach Photos/Videos <span className="text-muted-foreground">(Optional - Max 3 files, 10MB each)</span>
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-2">
                    Drag and drop files or <button type="button" className="text-primary hover:underline">browse</button>
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    accept="image/*,video/*"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <span className="text-xs text-muted-foreground">Supported: Images & Videos</span>
                  </label>
                </div>

                {fileError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-600">{fileError}</p>
                  </div>
                )}

                {/* File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-semibold text-foreground">Uploaded Files</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          {preview.type === 'image' ? (
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-32 object-cover rounded-lg border border-border"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded-lg border border-border flex items-center justify-center">
                              <Play className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{preview.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Location Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Location Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleInputChange}
                      placeholder="Enter street address or location name"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="location_District"
                        value={formData.location_District}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select district</option>
                        {districts.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Taluka <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location_taluk"
                        value={formData.location_taluk}
                        onChange={handleInputChange}
                        placeholder="Enter taluka name"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Ward Number <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      placeholder="Ward number if applicable"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Priority Level */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {['low', 'medium', 'high'].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority_level"
                        value={level}
                        checked={formData.priority_level === level}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium text-foreground capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button 
                  type="submit"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-yellow-500 font-semibold py-3 rounded-lg transition-all duration-200"
                  size="lg"
                >
                  Submit Complaint
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 py-3"
                  size="lg"
                  onClick={() => {
                    setFormData({
                      title: '',
                      Category: '',
                      Description: '',
                      location_address: '',
                      location_District: '',
                      location_taluk: '',
                      ward: '',
                      priority_level: 'medium',
                      latitude: 0,
                      longitude: 0,
                    })
                    setUploadedFiles([])
                    setFilePreviews([])
                    setSubmitted(false)
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Map & Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Map Component */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Location Map</h3>
                <ComplaintMap 
                  onLocationSelect={handleLocationSelect}
                  latitude={formData.latitude || undefined}
                  longitude={formData.longitude || undefined}
                />
              </div>

              {/* Complaint Guidelines */}
              <div className="glass-effect rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Important Guidelines</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                    <span className="text-sm text-muted-foreground">Provide clear and accurate information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                    <span className="text-sm text-muted-foreground">Attach photos/videos as evidence</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                    <span className="text-sm text-muted-foreground">Include exact location details</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                    <span className="text-sm text-muted-foreground">Avoid duplicate complaints</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                    <span className="text-sm text-muted-foreground">Be respectful and factual in description</span>
                  </li>
                </ul>
              </div>

              {/* Info Card */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Tracking Your Complaint</p>
                    <p className="text-xs text-muted-foreground">You will receive a unique complaint ID after submission. Use this ID to track the status and progress of your complaint anytime.</p>
                  </div>
                </div>
              </div>

              {/* Expected Timeline Card */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                <div className="flex gap-3">
                  <div className="text-2xl">⏱️</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Expected Resolution Time</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>High Priority: 2-3 days</li>
                      <li>Medium Priority: 5-7 days</li>
                      <li>Low Priority: 10-14 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

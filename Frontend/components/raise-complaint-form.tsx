'use client'


import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { MapPin, Upload, X, AlertCircle, Play } from 'lucide-react'

const ComplaintMap = dynamic(() => import('./complaint-map'), { ssr: false })

// ↩️ REVERTED TO ORIGINAL
const categories = [
  { value: 'ROADS', label: 'Roads & Infrastructure' },
  { value: 'TRAFFIC', label: 'Traffic & Road Safety' },
  { value: 'WATER', label: 'Water Supply' },
  { value: 'SEWERAGE', label: 'Sewerage & Drainage' },
  { value: 'SANITATION', label: 'Sanitation & Garbage' },
  { value: 'LIGHTING', label: 'Street Lighting' },
  { value: 'PARKS', label: 'Parks & Public Spaces' },
  { value: 'ANIMALS', label: 'Stray Animals' },
  { value: 'ILLEGAL_CONSTRUCTION', label: 'Illegal Construction' },
  { value: 'ENCROACHMENT', label: 'Encroachment' },
  { value: 'PROPERTY_DAMAGE', label: 'Public Property Damage' },
  { value: 'ELECTRICITY', label: 'Electricity & Power Issues' },
  { value: 'OTHER', label: 'Other' },
]

const districts = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad'
]

export default function RaiseComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    Category: '',
    Description: '',
    location_address: '',
    location_District: '',
    location_taluk: '',
    ward: '',
    priority_level: 'medium', // ↩️ REVERTED TO ORIGINAL
    latitude: 0,
    longitude: 0,
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [filePreviews,  setFilePreviews] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fileError, setFileError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return
    }
    
    setIsSubmitting(true)
    
    // Validate required fields
    if (!formData.title || !formData.Category || !formData.Description || !formData.location_address || !formData.location_District || !formData.location_taluk || !formData.priority_level) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Validate priority level
    const validPriorities = ['low', 'medium', 'high']
    if (!validPriorities.includes(formData.priority_level.toLowerCase())) {
      alert("Invalid priority level selected")
      setIsSubmitting(false)
      return
    }

    // Validate field lengths
    if (formData.title.length > 200) {
      alert("Title is too long (max 200 characters)")
      setIsSubmitting(false)
      return
    }
    if (formData.Description.length > 2000) {
      alert("Description is too long (max 2000 characters)")
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data for backend - only send fields that exist in Django model
      // Generate unique complaint ID (max 10 characters)
      const generateCompId = () => {
        const timestamp = Date.now().toString(36) // Convert to base36 for shorter string
        const random = Math.random().toString(36).substring(2, 5) // 3 random chars
        const extraRandom = Math.random().toString(36).substring(2, 4) // 2 more random chars
        return `CMP-${timestamp.slice(-4)}${random}${extraRandom}`.slice(0, 10) // Total: 4 + 6 = 10 chars
      }

      const submitData = {
        id: generateCompId(), // Generate unique complaint ID (max 10 chars)
        title: formData.title,
        Category: formData.Category,
        Description: formData.Description,
        location_address: formData.location_address,
        location_District: formData.location_District,
        location_taluk: formData.location_taluk,
        priority_level: formData.priority_level.charAt(0).toUpperCase() + formData.priority_level.slice(1), // Convert to TitleCase
        status: 'Pending'
      }

      console.log('Submitting data:', submitData)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const endpoint = `${API_BASE_URL}/api/raisecomplaint/`
      console.log('Submitting to endpoint:', endpoint)

      // Add retry logic for server errors
      let response: Response | undefined
      let retryCount = 0
      const maxRetries = 2
      
      while (retryCount <= maxRetries) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(submitData) 
          })
          
          // If successful, break out of retry loop
          if (response.ok) {
            break
          }
          
          // If 500 error and we haven't exhausted retries, wait and retry
          if (response.status === 500 && retryCount < maxRetries) {
            console.log(`Server error 500, retrying... (${retryCount + 1}/${maxRetries + 1})`)
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
            retryCount++
            continue
          }
          
          // For other errors or if we've exhausted retries, break
          break
        } catch (fetchError) {
          console.error('Fetch error:', fetchError)
          if (retryCount < maxRetries) {
            console.log(`Fetch failed, retrying... (${retryCount + 1}/${maxRetries + 1})`)
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
            retryCount++
            continue
          }
          throw fetchError
        }
      }

      // Ensure response is defined
      if (!response) {
        throw new Error('Failed to get response from server')
      }

      let data = {}
      try {
        const text = await response.text()
        console.log('Raw response text:', text)
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        
        // Check if response is HTML (error page) instead of JSON
        if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
          console.error('Server returned HTML instead of JSON - likely an error page')
          console.error('HTML response preview:', text.substring(0, 500))
          throw new Error(`Server error (${response.status}): Backend returned an error page instead of JSON response`)
        }
        
        if (text) {
          data = JSON.parse(text)
        }
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError)
        // If JSON parsing fails and response is not OK, it's likely a server error
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
        // If response is OK but JSON parsing failed, it's a format issue
        throw new Error('Invalid response format from server')
      }

      console.log('Parsed server response:', data)

      // Check response status first
      if (!response.ok) {
        const errorMsg = (data as any).errors 
          ? Object.entries((data as any).errors).map(([key, val]) => `${key}: ${val}`).join(', ')
          : (data as any).message || `Server error: ${response.status} ${response.statusText}`
        throw new Error(errorMsg)
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
        priority_level: 'medium', // ↩️ REVERTED TO ORIGINAL
        latitude: 0,
        longitude: 0,
      })
      setUploadedFiles([])
      setFilePreviews([])
    } catch (error: any) {
      console.error('Complaint submission error:', error)
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to submit complaint. Please try again.'
      
      if (error.message.includes('Server error (500)') || error.message.includes('Internal Server Error')) {
        errorMessage = 'Server is currently experiencing technical difficulties. Please try again in a few minutes.'
      } else if (error.message.includes('Server error (404)')) {
        errorMessage = 'Complaint submission endpoint not found. Please contact support.'
      } else if (error.message.includes('Server error (400)')) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.'
      } else if (error.message.includes('id') || error.message.includes('already exists')) {
        errorMessage = 'Complaint ID conflict. Please try submitting again.'
      } else if (error.message.includes('Server returned an error page')) {
        errorMessage = 'Server is experiencing issues. Please try again later.'
      } else if (error.message.includes('Invalid response format')) {
        errorMessage = 'Server response format is invalid. Please contact support.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(`Error: ${errorMessage}`)
      setSubmitted(false) // Reset submitted state on error
      setIsSubmitting(false) // Reset submitting state on error
    } finally {
      setIsSubmitting(false) // Ensure loading state is reset
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
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                {/* ↩️ REVERTED TO ORIGINAL */}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Complaint'
                  )}
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
                      priority_level: 'medium', // ↩️ REVERTED TO ORIGINAL
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

import React, { useState } from 'react';
import { User, Building2, Plus, Search, Users, BarChart3, Settings, MessageSquare, Calendar, Phone, Mail, MapPin, DollarSign, UserCheck, UserX, Eye, Edit2, Save, X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import './App.css';

const SimpleCRM = () => {
  // Current user and authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@company.com', role: 'admin', active: true },
    { id: 2, name: 'BD Rep 1', email: 'bd1@company.com', role: 'user', active: true },
    { id: 3, name: 'BD Rep 2', email: 'bd2@company.com', role: 'user', active: false }
  ]);

  // Custom fields configuration
  const [customFields, setCustomFields] = useState([
    { id: 'name', label: 'Company Name', type: 'text', required: true, system: true },
    { id: 'industry', label: 'Industry', type: 'text', required: false, system: true },
    { id: 'size', label: 'Company Size', type: 'select', required: false, system: true, options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
    { id: 'revenue', label: 'Annual Revenue', type: 'text', required: false, system: true },
    { id: 'status', label: 'Status', type: 'select', required: false, system: true, options: ['Prospect', 'Active', 'Inactive'] },
    { id: 'phone', label: 'Phone', type: 'tel', required: false, system: true },
    { id: 'email', label: 'Email', type: 'email', required: false, system: true },
    { id: 'address', label: 'Address', type: 'text', required: false, system: true },
    { id: 'website', label: 'Website', type: 'url', required: false, system: true }
  ]);

  // Sample data
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Acme Corporation',
      industry: 'Technology',
      size: '500-1000',
      revenue: '$50M',
      status: 'Active',
      phone: '(555) 123-4567',
      email: 'contact@acme.com',
      address: '123 Business St, City, ST 12345',
      website: 'www.acme.com',
      createdAt: '2024-01-15',
      createdBy: 1
    },
    {
      id: 2,
      name: 'Global Solutions Inc',
      industry: 'Consulting',
      size: '100-500',
      revenue: '$25M',
      status: 'Prospect',
      phone: '(555) 987-6543',
      email: 'info@globalsolutions.com',
      address: '456 Enterprise Ave, City, ST 67890',
      website: 'www.globalsolutions.com',
      createdAt: '2024-02-01',
      createdBy: 2
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      companyId: 1,
      userId: 1,
      type: 'note',
      content: 'Initial contact made. Very interested in our services.',
      timestamp: '2024-03-01T10:30:00Z'
    },
    {
      id: 2,
      companyId: 1,
      userId: 2,
      type: 'call',
      content: 'Follow-up call scheduled for next week.',
      timestamp: '2024-03-02T14:15:00Z'
    },
    {
      id: 3,
      companyId: 2,
      userId: 1,
      type: 'note',
      content: 'Sent proposal. Waiting for response.',
      timestamp: '2024-03-03T09:45:00Z'
    }
  ]);

  // UI State
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewFieldForm, setShowNewFieldForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importResults, setImportResults] = useState(null);

  // Form states
  const [newCompany, setNewCompany] = useState({
    name: '', industry: '', size: '', revenue: '', status: 'Prospect',
    phone: '', email: '', address: '', website: ''
  });
  const [newActivity, setNewActivity] = useState({ content: '', type: 'note' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [newField, setNewField] = useState({ 
    label: '', 
    type: 'text', 
    required: false,
    options: []
  });

  // Login simulation
  const handleLogin = (userId) => {
    const user = users.find(u => u.id === userId && u.active);
    if (user) setCurrentUser(user);
  };

  // CSV/Import functionality
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('File must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Map CSV headers to our field IDs
      const fieldMapping = {};
      const availableFields = customFields.map(f => ({ id: f.id, label: f.label }));
      
      headers.forEach(header => {
        const headerLower = header.toLowerCase();
        const matchedField = availableFields.find(field => 
          field.label.toLowerCase() === headerLower ||
          field.id.toLowerCase() === headerLower ||
          (headerLower.includes('company') && field.id === 'name') ||
          (headerLower.includes('business') && field.id === 'name') ||
          (headerLower.includes('organization') && field.id === 'name')
        );
        
        if (matchedField) {
          fieldMapping[header] = matchedField.id;
        }
      });

      setImportPreview({
        headers,
        rows: rows.slice(0, 5), // Preview first 5 rows
        totalRows: rows.length,
        fieldMapping,
        allRows: rows
      });

    } catch (error) {
      alert('Error reading file. Please make sure it\\'s a valid CSV file.');
    }
  };

  const updateFieldMapping = (csvHeader, fieldId) => {
    setImportPreview(prev => ({
      ...prev,
      fieldMapping: {
        ...prev.fieldMapping,
        [csvHeader]: fieldId
      }
    }));
  };

  const processImport = () => {
    if (!importPreview) return;

    const { allRows, fieldMapping } = importPreview;
    const imported = [];
    const errors = [];

    allRows.forEach((row, index) => {
      try {
        const company = {};
        
        // Map CSV data to our fields
        Object.entries(fieldMapping).forEach(([csvHeader, fieldId]) => {
          if (fieldId && row[csvHeader] !== undefined) {
            company[fieldId] = row[csvHeader];
          }
        });

        // Set defaults for required fields if missing
        if (!company.name || !company.name.trim()) {
          errors.push(`Row ${index + 2}: Company name is required`);
          return;
        }

        // Set default status if not provided
        if (!company.status) {
          company.status = 'Prospect';
        }

        // Add system fields
        company.id = Math.max(...companies.map(c => c.id), 0) + imported.length + 1;
        company.createdAt = new Date().toISOString().split('T')[0];
        company.createdBy = currentUser.id;

        // Ensure all custom fields exist (set empty string for missing ones)
        customFields.forEach(field => {
          if (company[field.id] === undefined) {
            company[field.id] = '';
          }
        });

        imported.push(company);
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    });

    // Add imported companies to the list
    setCompanies([...companies, ...imported]);

    setImportResults({
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors
    });

    setImportPreview(null);
  };

  const downloadTemplate = () => {
    const headers = customFields.map(field => field.label);
    const csvContent = headers.join(',') + '\n';
    const exampleRow = customFields.map(field => {
      switch (field.id) {
        case 'name': return 'Example Company Inc';
        case 'industry': return 'Technology';
        case 'email': return 'contact@example.com';
        case 'phone': return '(555) 123-4567';
        case 'status': return 'Prospect';
        case 'size': return '50-100';
        case 'revenue': return '$5M';
        case 'website': return 'www.example.com';
        case 'address': return '123 Main St, City, ST 12345';
        default: return 'Sample Data';
      }
    }).join(',');
    
    const blob = new Blob([csvContent + exampleRow], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Custom field management
  const addCustomField = () => {
    if (!newField.label.trim()) return;
    
    const fieldId = newField.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const field = {
      id: fieldId,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      system: false,
      options: newField.type === 'select' ? newField.options.filter(opt => opt.trim()) : undefined
    };
    
    setCustomFields([...customFields, field]);
    
    // Add default value to all existing companies
    setCompanies(companies.map(company => ({
      ...company,
      [fieldId]: ''
    })));
    
    // Reset form
    setNewField({ label: '', type: 'text', required: false, options: [] });
    setShowNewFieldForm(false);
  };

  const removeCustomField = (fieldId) => {
    if (customFields.find(f => f.id === fieldId)?.system) return; // Can't remove system fields
    
    setCustomFields(customFields.filter(f => f.id !== fieldId));
    
    // Remove field from all companies
    setCompanies(companies.map(company => {
      const { [fieldId]: removed, ...rest } = company;
      return rest;
    }));
  };

  // Helper functions for field rendering
  const renderFieldInput = (field, value, onChange, disabled = false, isEditing = false) => {
    const commonProps = {
      value: value || '',
      onChange: (e) => onChange(field.id, e.target.value, isEditing),
      disabled,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{field.required ? `Select ${field.label}` : `Select ${field.label} (Optional)`}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea {...commonProps} rows={3} placeholder={field.label} />;
      default:
        return <input {...commonProps} type={field.type} placeholder={field.label + (field.required ? ' *' : '')} />;
    }
  };

  // Company management
  const addCompany = () => {
    const requiredFields = customFields.filter(f => f.required);
    const missingRequired = requiredFields.some(field => !newCompany[field.id]?.trim());
    
    if (missingRequired) return;
    
    const company = {
      ...newCompany,
      id: Math.max(...companies.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id
    };
    
    setCompanies([...companies, company]);
    
    // Reset form with all custom fields
    const resetForm = {};
    customFields.forEach(field => {
      resetForm[field.id] = field.type === 'select' ? (field.required ? '' : '') : '';
    });
    resetForm.status = 'Prospect'; // Default status
    
    setNewCompany(resetForm);
    setShowNewCompanyForm(false);
  };

  const updateCompany = () => {
    setCompanies(companies.map(a => a.id === editingCompany.id ? editingCompany : a));
    setEditingCompany(null);
    if (selectedCompany?.id === editingCompany.id) {
      setSelectedCompany(editingCompany);
    }
  };

  const handleCompanyFieldChange = (fieldId, value, isEditing = false) => {
    if (isEditing) {
      setEditingCompany({ ...editingCompany, [fieldId]: value });
    } else {
      setNewCompany({ ...newCompany, [fieldId]: value });
    }
  };

  // Activity management
  const addActivity = () => {
    if (!newActivity.content.trim() || !selectedCompany) return;
    
    const activity = {
      id: Math.max(...activities.map(a => a.id), 0) + 1,
      companyId: selectedCompany.id,
      userId: currentUser.id,
      ...newActivity,
      timestamp: new Date().toISOString()
    };
    
    setActivities([...activities, activity]);
    setNewActivity({ content: '', type: 'note' });
  };

  // User management (admin only)
  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    
    const user = {
      ...newUser,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      active: true
    };
    
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user' });
    setShowNewUserForm(false);
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ));
  };

  // Filtering
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompanyActivities = (companyId) => {
    return activities
      .filter(a => a.companyId === companyId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getUserName = (userId) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="text-center mb-6">
            <Building2 className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Simple CRM</h1>
            <p className="text-gray-600">Select a user to login</p>
          </div>
          <div className="space-y-3">
            {users.filter(u => u.active).map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email} • {user.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Simple CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { setActiveView('dashboard'); setSelectedCompany(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                      activeView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveView('companies'); setSelectedCompany(null); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                      activeView === 'companies' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Companies</span>
                  </button>
                </li>
                {currentUser.role === 'admin' && (
                  <li>
                    <button
                      onClick={() => { setActiveView('fields'); setSelectedCompany(null); }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                        activeView === 'fields' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Custom Fields</span>
                    </button>
                  </li>
                )}
                {currentUser.role === 'admin' && (
                  <li>
                    <button
                      onClick={() => { setActiveView('users'); setSelectedCompany(null); }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                        activeView === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      <span>User Management</span>
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
                        <div className="text-sm text-gray-600">Total Companies</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserCheck className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {companies.filter(a => a.status === 'Active').length}
                        </div>
                        <div className="text-sm text-gray-600">Active Companies</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Eye className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {companies.filter(a => a.status === 'Prospect').length}
                        </div>
                        <div className="text-sm text-gray-600">Prospects</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MessageSquare className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{activities.length}</div>
                        <div className="text-sm text-gray-600">Total Activities</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {activities
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 5)
                        .map(activity => {
                          const company = companies.find(a => a.id === activity.companyId);
                          return (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm">
                                  <span className="font-medium">{getUserName(activity.userId)}</span>
                                  {' added a '}
                                  <span className="text-blue-600">{activity.type}</span>
                                  {' to '}
                                  <button
                                    onClick={() => {
                                      setSelectedCompany(company);
                                      setActiveView('company-detail');
                                    }}
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                  >
                                    {company?.name}
                                  </button>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{activity.content}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDate(activity.timestamp)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Companies View */}
            {activeView === 'companies' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowImportForm(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Import CSV</span>
                    </button>
                    <button
                      onClick={() => setShowNewCompanyForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Company</span>
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Companies List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Industry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCompanies.map(company => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{company.name}</div>
                              <div className="text-sm text-gray-500">{company.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {company.industry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              company.status === 'Active' ? 'bg-green-100 text-green-800' :
                              company.status === 'Prospect' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {company.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {company.revenue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedCompany(company);
                                setActiveView('company-detail');
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setEditingCompany({ ...company })}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Company Detail View */}
            {activeView === 'company-detail' && selectedCompany && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveView('companies')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ← Back to Companies
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                  <button
                    onClick={() => setEditingCompany({ ...selectedCompany })}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center space-x-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Company Info */}
                  <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {customFields.filter(f => f.id !== 'name').map(field => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm text-gray-500">{field.label}</div>
                            <div className="text-sm font-medium">{selectedCompany[field.id] || 'Not specified'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedCompany.status === 'Active' ? 'bg-green-100 text-green-800' :
                          selectedCompany.status === 'Prospect' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedCompany.status}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Total Activities</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {getCompanyActivities(selectedCompany.id).length}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="text-sm font-medium">
                          {new Date(selectedCompany.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Stream */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Activity Stream</h3>
                  </div>
                  <div className="p-6">
                    {/* Add Activity Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex space-x-4">
                        <select
                          value={newActivity.type}
                          onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="note">Note</option>
                          <option value="call">Call</option>
                          <option value="email">Email</option>
                          <option value="meeting">Meeting</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Add activity..."
                          value={newActivity.content}
                          onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && addActivity()}
                        />
                        <button
                          onClick={addActivity}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-4">
                      {getCompanyActivities(selectedCompany.id).map(activity => (
                        <div key={activity.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                          <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{getUserName(activity.userId)}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                activity.type === 'note' ? 'bg-blue-100 text-blue-800' :
                                activity.type === 'call' ? 'bg-green-100 text-green-800' :
                                activity.type === 'email' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {activity.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700 mt-1">{activity.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Fields View (Admin Only) */}
            {activeView === 'fields' && currentUser.role === 'admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Custom Fields</h2>
                  <button
                    onClick={() => setShowNewFieldForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Field</span>
                  </button>
                </div>

                {/* Fields List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Required
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          System Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customFields.map(field => (
                        <tr key={field.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{field.label}</div>
                            {field.options && (
                              <div className="text-xs text-gray-500">
                                Options: {field.options.join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {field.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.required ? 'Yes' : 'No'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.system ? 'Yes' : 'No'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!field.system && (
                              <button
                                onClick={() => removeCustomField(field.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Field Preview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">All Company Fields Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customFields.map(field => (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderFieldInput(field, '', () => {}, true)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* User Management View (Admin Only) */}
            {activeView === 'users' && currentUser.role === 'admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <button
                    onClick={() => setShowNewUserForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                  </button>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-10 w-10 text-gray-400" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.id !== currentUser.id && (
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`${
                                  user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {user.active ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Modal Components */}
        {/* ... (continuing with modals) */}
      </div>
    </div>
  );
};

export default SimpleCRM;

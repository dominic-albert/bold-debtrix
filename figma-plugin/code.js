// Figma plugin main code
figma.showUI(__html__, { 
  width: 420, 
  height: 700,
  themeColors: true 
});

// Store API key and user data
var apiKey| null = null;
var userData: any = null;
var config: { apiBaseUrl; anonKey: string } | null = null;

// Load stored data on startup
function loadStoredData() {
  try {
    var [storedKey, storedConfig] = Promise.all([
      figma.clientStorage.getAsync('debtrix_api_key'),
      figma.clientStorage.getAsync('debtrix_config')
    ]);
    
    if (storedConfig) {
      config = storedConfig;
      figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
    }
    
    if (storedKey && storedConfig) {
      apiKey = storedKey;
      figma.ui.postMessage({ type: 'api-key-loaded', apiKey: storedKey });
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
}

// Initialize
loadStoredData();

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'load-config':
        var storedConfig = figma.clientStorage.getAsync('debtrix_config');
        figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
        break;
        
      case 'save-config':
        config = msg.config;
        figma.clientStorage.setAsync('debtrix_config', config);
        break;
        
      case 'verify-api-key':
        config = { apiBaseUrl: msg.apiBaseUrl, anonKey: msg.anonKey };
        verifyApiKey(msg.apiKey);
        break;
        
      case 'get-projects':
        getProjects();
        break;
        
      case 'get-ux-debts':
        getUXDebts(msg.projectId);
        break;
        
      case 'create-ux-debt':
        createUXDebt(msg.projectId, msg.debtData);
        break;
        
      case 'update-ux-debt':
        updateUXDebt(msg.projectId, msg.debtId, msg.debtData);
        break;
        
      case 'delete-ux-debt':
        deleteUXDebt(msg.projectId, msg.debtId);
        break;
        
      case 'get-figma-context':
        getFigmaContext();
        break;
        
      case 'logout':
        figma.clientStorage.deleteAsync('debtrix_api_key');
        apiKey = null;
        userData = null;
        break;
        
      case 'close-plugin':
        figma.closePlugin();
        break;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.ui.postMessage({ 
      type: 'error', 
      error: (error as any).message || 'An unexpected error occurred' 
    });
  }
};

function verifyApiKey(key) {
  if (!config) {
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: 'Configuration not found' 
    });
    return;
  }
  
  try {
    var response = fetch(`${config.apiBaseUrl}/rest/v1/profiles?select=id,email,full_name`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': key,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    var data = response.json();
    if (!data || data.length === 0) {
      throw new Error('Invalid API key - no user found');
    }
    
    apiKey = key;
    userData = data[0];
    
    // Store API key
    figma.clientStorage.setAsync('debtrix_api_key', key);
    
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: true, 
      user: userData 
    });
  } catch (error) {
    console.error('API key verification error:', error);
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: (error as any).message || 'Failed to verify API key'
    });
  }
}

function getProjects() {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: 'Not authenticated or configured' 
    });
    return;
  }
  
  try {
    var response = fetch(`${config.apiBaseUrl}/rest/v1/projects?owner_id=eq.${userData.id}&select=id,title,description,color,created_at,updated_at&order=updated_at.desc`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    var projects = response.json();
    
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: true, 
      projects 
    });
  } catch (error) {
    console.error('Get projects error:', error);
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: (error as any).message || 'Failed to fetch projects'
    });
  }
}

function getUXDebts(projectId) {
  if (!apiKey || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    var response = fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?project_id=eq.${projectId}&select=*&order=created_at.desc`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    var debts = response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: true, 
      debts 
    });
  } catch (error) {
    console.error('Get UX debts error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: (error as any).message || 'Failed to fetch UX debts'
    });
  }
}

function createUXDebt(projectId, debtData) {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    // Get Figma context
    var figmaContext = getFigmaContextData();
    
    // Use Object.assign instead of spread operator for ES5 compatibility
    var payload = Object.assign({}, debtData, {
      project_id: projectId,
      logged_by: userData.full_name,
      figma_url: figmaContext.url,
      screen: debtData.screen || figmaContext.pageName
    });
    
    var response = fetch(`${config.apiBaseUrl}/rest/v1/ux_debts`, {
      method: 'POST',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    var debt = response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: true, 
      debt: Array.isArray(debt) ? debt[0] : debt
    });
  } catch (error) {
    console.error('Create UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: (error as any).message || 'Failed to create UX debt'
    });
  }
}

function updateUXDebt(projectId, debtId, debtData) {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    var response = fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?id=eq.${debtId}`, {
      method: 'PATCH',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(debtData)
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    var debt = response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: true, 
      debt: Array.isArray(debt) ? debt[0] : debt
    });
  } catch (error) {
    console.error('Update UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: false, 
      error: (error as any).message || 'Failed to update UX debt'
    });
  }
}

function deleteUXDebt(projectId, debtId) {
  if (!apiKey || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    var response = fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?id=eq.${debtId}`, {
      method: 'DELETE',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      var errorText = response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: true
    });
  } catch (error) {
    console.error('Delete UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: false, 
      error: (error as any).message || 'Failed to delete UX debt'
    });
  }
}

function getFigmaContext() {
  var context = getFigmaContextData();
  figma.ui.postMessage({ 
    type: 'figma-context', 
    context 
  });
}

function getFigmaContextData() {
  try {
    var selection = figma.currentPage.selection;
    var pageName = figma.currentPage.name;
    var fileName = figma.root.name;
    
    console.log('=== FIGMA CONTEXT DEBUG ===');
    console.log('Page name:', pageName);
    console.log('File name:', fileName);
    console.log('Selection count:', selection.length);
    console.log('Selected nodes:', selection.map(node => ({ id: node.id, name: node.name })));
    
    // Get the file key - improved method for Figma plugin environment
    var fileKey| null = null;
    
    try {
      // Method 1: Check if figma.fileKey is available (most reliable in plugin context)
      if (typeof (figma as any).fileKey === 'string' && (figma as any).fileKey) {
        fileKey = (figma as any).fileKey;
        console.log('File key from figma.fileKey:', fileKey);
      }
      
      // Method 2: Try to extract from document URL if available
      if (!fileKey && typeof (figma as any).root?.getSharedPluginData === 'function') {
        try {
          var urlData = (figma as any).root.getSharedPluginData('figma', 'fileUrl');
          if (urlData) {
            var urlMatch = urlData.match(/\/file\/([a-zA-Z0-9]+)/);
            if (urlMatch) {
              fileKey = urlMatch[1];
              console.log('File key from shared plugin data:', fileKey);
            }
          }
        } catch (e) {
          console.log('Could not get shared plugin data:', e);
        }
      }
      
      // Method 3: Try to get from root ID (fallback)
      if (!fileKey && figma.root && figma.root.id) {
        var rootId = figma.root.id;
        console.log('Root ID:', rootId);
        
        // Extract potential file key from root ID
        if (rootId.includes(':')) {
          fileKey = rootId.split(':')[0];
        } else if (rootId.length >= 22) {
          fileKey = rootId.substring(0, 22);
        }
        console.log('File key from root ID:', fileKey);
      }
      
      // Method 4: Try to access document metadata
      if (!fileKey && typeof (figma as any).root?.getPluginData === 'function') {
        try {
          var storedFileKey = (figma as any).root.getPluginData('fileKey');
          if (storedFileKey) {
            fileKey = storedFileKey;
            console.log('File key from plugin data:', fileKey);
          }
        } catch (e) {
          console.log('Could not get plugin data:', e);
        }
      }
      
    } catch (e) {
      console.error('Error determining file key:', e);
    }
    
    console.log('Final file key:', fileKey);
    
    // Build the URL with improved logic
    var url = 'https://www.figma.com/design/';
    
    if (fileKey) {
      // Use the design URL format which is more reliable
      url += `${fileKey}/${encodeURIComponent(fileName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-'))}`;
      
      // If nodes are selected, create a direct link to the selection
      if (selection.length > 0) {
        var nodeIds = selection.map(node => {
          // Convert node ID to URL format (replace colons with dashes)
          return node.id.replace(/:/g, '-');
        });
        
        // Use the first selected node as primary, others as additional context
        url += `?node-id=${encodeURIComponent(nodeIds[0])}`;
        
        // Add additional selected nodes if any
        if (nodeIds.length > 1) {
          url += `&t=${encodeURIComponent(nodeIds.slice(1).join(','))}`;
        }
        
        console.log('Generated URL with selection:', url);
      } else {
        // No selection, link to the page
        url += `?page-id=${encodeURIComponent(figma.currentPage.id.replace(/:/g, '-'))}`;
        console.log('Generated URL for page:', url);
      }
    } else {
      // Fallback: create a generic Figma URL
      url = 'https://www.figma.com/files/recent';
      console.warn('Could not determine file key, using fallback URL');
    }
    
    console.log('Final generated URL:', url);
    console.log('=== END FIGMA CONTEXT DEBUG ===');
    
    return {
      url,
      pageName,
      fileName,
      fileKey,
      selectedNodes: selection.length,
      selectedNodeNames: selection.map(node => node.name),
      debug: {
        hasFileKey: !!fileKey,
        figmaFileKeyAvailable: typeof (figma as any).fileKey !== 'undefined',
        figmaFileKeyValue: (figma as any).fileKey || 'undefined',
        rootId: figma.root ? figma.root.id : 'no root',
        generatedUrl: url
      }
    };
  } catch (error) {
    console.error('Error getting Figma context:', error);
    return {
      url: 'https://www.figma.com/files/recent',
      pageName: 'Unknown',
      fileName: 'Unknown',
      fileKey,
      selectedNodes: 0,
      selectedNodeNames: [],
      error: (error as any).message,
      debug: {
        hasFileKey: false,
        figmaFileKeyAvailable: false,
        figmaFileKeyValue: 'error',
        rootId: 'error',
        generatedUrl: 'fallback'
      }
    };
  }
}
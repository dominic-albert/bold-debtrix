// Figma plugin main code
figma.showUI(__html__, { 
  width: 420, 
  height: 700,
  themeColors: true 
});

// Store API key and user data
var apiKey = null;
var userData = null;
var config = null;

// Load stored data on startup
function loadStoredData() {
  try {
    Promise.all([
      figma.clientStorage.getAsync('debtrix_api_key'),
      figma.clientStorage.getAsync('debtrix_config')
    ]).then(function(results) {
      var storedKey = results[0];
      var storedConfig = results[1];
      
      if (storedConfig) {
        config = storedConfig;
        figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
      }
      
      if (storedKey && storedConfig) {
        apiKey = storedKey;
        figma.ui.postMessage({ type: 'api-key-loaded', apiKey: storedKey });
      }
    }).catch(function(error) {
      console.error('Error loading stored data:', error);
    });
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
}

// Initialize
loadStoredData();

// Listen for messages from UI
figma.ui.onmessage = function(msg) {
  try {
    switch (msg.type) {
      case 'load-config':
        figma.clientStorage.getAsync('debtrix_config').then(function(storedConfig) {
          figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
        });
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
      error: error.message || 'An unexpected error occurred' 
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
    fetch(config.apiBaseUrl + '/rest/v1/profiles?select=id,email,full_name', {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': key,
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (!response.ok) {
        return response.text().then(function(errorText) {
          throw new Error('HTTP ' + response.status + ': ' + errorText);
        });
      }
      return response.json();
    }).then(function(data) {
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
    }).catch(function(error) {
      console.error('API key verification error:', error);
      figma.ui.postMessage({ 
        type: 'api-key-verified', 
        success: false, 
        error: error.message || 'Failed to verify API key'
      });
    });
  } catch (error) {
    console.error('API key verification error:', error);
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: error.message || 'Failed to verify API key'
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
    fetch(config.apiBaseUrl + '/rest/v1/projects?owner_id=eq.' + userData.id + '&select=id,title,description,color,created_at,updated_at&order=updated_at.desc', {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (!response.ok) {
        return response.text().then(function(errorText) {
          throw new Error('HTTP ' + response.status + ': ' + errorText);
        });
      }
      return response.json();
    }).then(function(projects) {
      figma.ui.postMessage({ 
        type: 'projects-loaded', 
        success: true, 
        projects: projects 
      });
    }).catch(function(error) {
      console.error('Get projects error:', error);
      figma.ui.postMessage({ 
        type: 'projects-loaded', 
        success: false, 
        error: error.message || 'Failed to fetch projects'
      });
    });
  } catch (error) {
    console.error('Get projects error:', error);
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: error.message || 'Failed to fetch projects'
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
    fetch(config.apiBaseUrl + '/rest/v1/ux_debts?project_id=eq.' + projectId + '&select=*&order=created_at.desc', {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (!response.ok) {
        return response.text().then(function(errorText) {
          throw new Error('HTTP ' + response.status + ': ' + errorText);
        });
      }
      return response.json();
    }).then(function(debts) {
      figma.ui.postMessage({ 
        type: 'ux-debts-loaded', 
        success: true, 
        debts: debts,
        projectId: projectId // Include projectId for metadata updates
      });
    }).catch(function(error) {
      console.error('Get UX debts error:', error);
      figma.ui.postMessage({ 
        type: 'ux-debts-loaded', 
        success: false, 
        error: error.message || 'Failed to fetch UX debts'
      });
    });
  } catch (error) {
    console.error('Get UX debts error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: error.message || 'Failed to fetch UX debts'
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
    getFigmaContextData().then(function(figmaContext) {
      var payload = {
        title: debtData.title,
        type: debtData.type,
        severity: debtData.severity,
        description: debtData.description,
        recommendation: debtData.recommendation,
        project_id: projectId,
        logged_by: userData.full_name,
        figma_url: figmaContext.url,
        screen: debtData.screen || figmaContext.pageName,
        status: 'Open'
      };
      
      fetch(config.apiBaseUrl + '/rest/v1/ux_debts', {
        method: 'POST',
        headers: {
          'apikey': config.anonKey,
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      }).then(function(response) {
        if (!response.ok) {
          return response.text().then(function(errorText) {
            throw new Error('HTTP ' + response.status + ': ' + errorText);
          });
        }
        return response.json();
      }).then(function(debt) {
        figma.ui.postMessage({ 
          type: 'ux-debt-created', 
          success: true, 
          debt: Array.isArray(debt) ? debt[0] : debt
        });
      }).catch(function(error) {
        console.error('Create UX debt error:', error);
        figma.ui.postMessage({ 
          type: 'ux-debt-created', 
          success: false, 
          error: error.message || 'Failed to create UX debt'
        });
      });
    });
  } catch (error) {
    console.error('Create UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: error.message || 'Failed to create UX debt'
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
    fetch(config.apiBaseUrl + '/rest/v1/ux_debts?id=eq.' + debtId, {
      method: 'PATCH',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(debtData)
    }).then(function(response) {
      if (!response.ok) {
        return response.text().then(function(errorText) {
          throw new Error('HTTP ' + response.status + ': ' + errorText);
        });
      }
      return response.json();
    }).then(function(debt) {
      figma.ui.postMessage({ 
        type: 'ux-debt-updated', 
        success: true, 
        debt: Array.isArray(debt) ? debt[0] : debt
      });
    }).catch(function(error) {
      console.error('Update UX debt error:', error);
      figma.ui.postMessage({ 
        type: 'ux-debt-updated', 
        success: false, 
        error: error.message || 'Failed to update UX debt'
      });
    });
  } catch (error) {
    console.error('Update UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: false, 
      error: error.message || 'Failed to update UX debt'
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
    fetch(config.apiBaseUrl + '/rest/v1/ux_debts?id=eq.' + debtId, {
      method: 'DELETE',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if (!response.ok) {
        return response.text().then(function(errorText) {
          throw new Error('HTTP ' + response.status + ': ' + errorText);
        });
      }
      
      figma.ui.postMessage({ 
        type: 'ux-debt-deleted', 
        success: true
      });
    }).catch(function(error) {
      console.error('Delete UX debt error:', error);
      figma.ui.postMessage({ 
        type: 'ux-debt-deleted', 
        success: false, 
        error: error.message || 'Failed to delete UX debt'
      });
    });
  } catch (error) {
    console.error('Delete UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: false, 
      error: error.message || 'Failed to delete UX debt'
    });
  }
}

function getFigmaContext() {
  getFigmaContextData().then(function(context) {
    figma.ui.postMessage({ 
      type: 'figma-context', 
      context: context 
    });
  });
}

function getFigmaContextData() {
  return new Promise(function(resolve) {
    try {
      var selection = figma.currentPage.selection;
      var pageName = figma.currentPage.name;
      var fileName = figma.root.name;
      
      // Get the file key from the current document
      var fileKey = null;
      var url = 'https://www.figma.com/file/';
      
      // Try to get file key from the document
      try {
        // Method 1: Try to get from figma.fileKey (if available)
        if (typeof figma.fileKey !== 'undefined' && figma.fileKey) {
          fileKey = figma.fileKey;
        }
        
        // Method 2: Try to get from the document URL if available
        if (!fileKey && figma.root && figma.root.getPluginData) {
          var storedFileKey = figma.root.getPluginData('fileKey');
          if (storedFileKey) {
            fileKey = storedFileKey;
          }
        }
        
        // Method 3: Try to extract from current URL if in browser context
        if (!fileKey && typeof window !== 'undefined' && window.location) {
          var urlMatch = window.location.href.match(/\/file\/([a-zA-Z0-9]+)/);
          if (urlMatch) {
            fileKey = urlMatch[1];
          }
        }
        
        // Method 4: Check if we can access the document's metadata
        if (!fileKey && figma.root && figma.root.id) {
          // Sometimes the file key might be derivable from the root ID
          var rootId = figma.root.id;
          if (rootId && rootId.length > 10) {
            fileKey = rootId.split(':')[0] || rootId.substring(0, 22);
          }
        }
      } catch (e) {
        console.log('Could not determine file key:', e);
      }
      
      // Build the URL
      if (fileKey) {
        url += fileKey + '/' + encodeURIComponent(fileName);
        
        // If nodes are selected, create a direct link to the first selected node
        if (selection.length > 0) {
          var nodeId = selection[0].id;
          // Convert node ID to URL format (replace colons with dashes)
          var formattedNodeId = nodeId.replace(/:/g, '-');
          url += '?node-id=' + encodeURIComponent(formattedNodeId);
          
          // Add viewport parameter to focus on the selected node
          url += '&viewport=0,0,1,1';
        }
      } else {
        // Fallback: create a generic Figma URL
        url = 'https://www.figma.com/files/recent';
        console.warn('Could not determine file key, using fallback URL');
      }
      
      resolve({
        url: url,
        pageName: pageName,
        fileName: fileName,
        fileKey: fileKey,
        selectedNodes: selection.length,
        selectedNodeNames: selection.map(function(node) { return node.name; }),
        debug: {
          hasFileKey: !!fileKey,
          figmaFileKeyAvailable: typeof figma.fileKey !== 'undefined',
          figmaFileKeyValue: figma.fileKey || 'undefined',
          rootId: figma.root ? figma.root.id : 'no root'
        }
      });
    } catch (error) {
      console.error('Error getting Figma context:', error);
      resolve({
        url: 'https://www.figma.com/files/recent',
        pageName: 'Unknown',
        fileName: 'Unknown',
        fileKey: null,
        selectedNodes: 0,
        selectedNodeNames: [],
        error: error.message,
        debug: {
          hasFileKey: false,
          figmaFileKeyAvailable: false,
          figmaFileKeyValue: 'error',
          rootId: 'error'
        }
      });
    }
  });
}
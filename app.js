/**
 * ProofLens AI — Editorial Application Controller
 * Manages the interactive verification workspace, example loading,
 * 4-stage analysis sequence, two-column results dashboard, Evidence Map sync,
 * and persistent Neon PostgreSQL verification history.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentText: '',
    attachedFile: null,
    activePresetId: 'scholarship_deadline',
    isAnalyzing: false,
    currentReport: null,
    activeFilter: 'ALL',
    selectedClaimId: null,

    // Neon PostgreSQL Verification History State
    historyPage: 1,
    historyPageSize: 6,
    historyTotalPages: 1,
    historyTotalCount: 0,
    historyReports: [],
    isLoadingHistory: false
  };

  // DOM Elements Cache
  const dom = {};

  function cacheDom() {
    dom.navbar = document.getElementById('navbar');
    dom.verifyTextarea = document.getElementById('verifyTextarea');
    dom.charCount = document.getElementById('charCount');
    dom.btnClear = document.getElementById('btnClear');
    dom.btnLoadExample = document.getElementById('btnLoadExample');
    dom.presetPills = document.querySelectorAll('.preset-pill');
    dom.fileDropzone = document.getElementById('fileDropzone');
    dom.fileInput = document.getElementById('fileInput');
    dom.uploadText = document.getElementById('uploadText');
    dom.btnAnalyze = document.getElementById('btnAnalyze');

    // Progress Scanner
    dom.analysisProgress = document.getElementById('analysisProgress');
    dom.scannerStageLabel = document.getElementById('scannerStageLabel');
    dom.stagePills = document.querySelectorAll('.stage-pill');

    // Results Dashboard
    dom.resultsDashboard = document.getElementById('resultsDashboard');
    dom.demoDataBadge = document.querySelector('.demo-data-badge');
    dom.dbPersistenceBadge = document.getElementById('dbPersistenceBadge');
    dom.reportDate = document.getElementById('reportDate');
    dom.reportClaimsCount = document.getElementById('reportClaimsCount');
    dom.metricTotal = document.getElementById('metricTotal');
    dom.metricSupported = document.getElementById('metricSupported');
    dom.metricPartial = document.getElementById('metricPartial');
    dom.metricContradicted = document.getElementById('metricContradicted');
    dom.metricUnverified = document.getElementById('metricUnverified');

    // Filter Chips
    dom.filterChips = document.querySelectorAll('.filter-chip');
    dom.claimsList = document.getElementById('claimsList');

    // Sticky Inspector Panel
    dom.inspectorPanel = document.getElementById('evidenceInspector');

    // Report Actions
    dom.btnCopyReport = document.getElementById('btnCopyReport');
    dom.btnExportJson = document.getElementById('btnExportJson');
    dom.btnNewAnalysis = document.getElementById('btnNewAnalysis');

    // Map Controls
    dom.btnZoomIn = document.getElementById('btnZoomIn');
    dom.btnZoomOut = document.getElementById('btnZoomOut');
    dom.btnResetGraph = document.getElementById('btnResetGraph');

    // Mobile Navigation
    dom.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    dom.navLinks = document.getElementById('navLinks');

    // Backend & TinyFish Status Modal Elements
    dom.btnBackendModal = document.getElementById('btnBackendModal');
    dom.backendDot = document.getElementById('backendDot');
    dom.backendStatusLabel = document.getElementById('backendStatusLabel');
    dom.backendModalBackdrop = document.getElementById('backendModalBackdrop');
    dom.btnCloseModal = document.getElementById('btnCloseModal');
    dom.modalFastApiBadge = document.getElementById('modalFastApiBadge');
    dom.modalEngineBadge = document.getElementById('modalEngineBadge');
    dom.modalTinyFishBadge = document.getElementById('modalTinyFishBadge');
    dom.modalNeonDbBadge = document.getElementById('modalNeonDbBadge');
    dom.modalDbDriverBadge = document.getElementById('modalDbDriverBadge');
    dom.inputTinyFishKey = document.getElementById('inputTinyFishKey');
    dom.btnCheckStatus = document.getElementById('btnCheckStatus');
    dom.btnSaveTinyFishKey = document.getElementById('btnSaveTinyFishKey');

    // Verification History Section Elements
    dom.historySection = document.getElementById('history');
    dom.historyDbDot = document.getElementById('historyDbDot');
    dom.historyDbStatusText = document.getElementById('historyDbStatusText');
    dom.btnRefreshHistory = document.getElementById('btnRefreshHistory');
    dom.btnRetryHistory = document.getElementById('btnRetryHistory');
    dom.historyLoadingState = document.getElementById('historyLoadingState');
    dom.historyErrorState = document.getElementById('historyErrorState');
    dom.historyErrorMessage = document.getElementById('historyErrorMessage');
    dom.historyEmptyState = document.getElementById('historyEmptyState');
    dom.historyGrid = document.getElementById('historyGrid');
    dom.historyPagination = document.getElementById('historyPagination');
    dom.btnPrevPage = document.getElementById('btnPrevPage');
    dom.btnNextPage = document.getElementById('btnNextPage');
    dom.paginationInfo = document.getElementById('paginationInfo');
  }

  function init() {
    cacheDom();

    // 1. Initialize 3D Hero Lens Observatory
    if (window.ProofLensHero3D) {
      window.heroLens = new window.ProofLensHero3D('observatoryContainer');
    }

    // 2. Initialize Evidence Map
    if (window.EvidenceConstellation) {
      window.constellation = new window.EvidenceConstellation('mapCanvas', 'mapDrawer');
    }

    // 3. Load default sample preset
    loadPreset(state.activePresetId);

    // 4. Bind UI Events
    bindEvents();

    // 5. Check backend health & sync status
    if (window.ProofLensApi) {
      window.ProofLensApi.checkBackendHealth().then(() => {
        refreshBackendModalStatus();
        fetchVerificationHistory(1);
      });
    }

    // 6. Run silent initial verification so dashboard & Evidence Map are fully populated
    setTimeout(() => {
      executeVerification(true);
    }, 300);
  }

  function bindEvents() {
    // Textarea input tracking
    if (dom.verifyTextarea) {
      dom.verifyTextarea.addEventListener('input', (e) => {
        state.currentText = e.target.value;
        updateCharCount();
      });
    }

    // Clear Button
    if (dom.btnClear) {
      dom.btnClear.addEventListener('click', () => {
        state.currentText = '';
        dom.verifyTextarea.value = '';
        updateCharCount();
        dom.verifyTextarea.focus();
      });
    }

    // Load Standard Example Button
    if (dom.btnLoadExample) {
      dom.btnLoadExample.addEventListener('click', () => {
        loadPreset('health_exercise');
      });
    }

    // Preset Pills
    dom.presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const presetId = pill.getAttribute('data-preset-id');
        loadPreset(presetId);
      });
    });

    // File Dropzone & Input
    if (dom.fileDropzone && dom.fileInput) {
      dom.fileDropzone.addEventListener('click', () => dom.fileInput.click());
      dom.fileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dom.fileDropzone.classList.add('drag-active');
      });
      dom.fileDropzone.addEventListener('dragleave', () => {
        dom.fileDropzone.classList.remove('drag-active');
      });
      dom.fileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.fileDropzone.classList.remove('drag-active');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
      dom.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileUpload(e.target.files[0]);
        }
      });
    }

    // Primary Analyze Button
    if (dom.btnAnalyze) {
      dom.btnAnalyze.addEventListener('click', () => {
        executeVerification(false);
      });
    }

    // Filter Chips
    dom.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dom.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeFilter = chip.getAttribute('data-filter');
        renderClaimsList();
      });
    });

    // Copy Report Summary
    if (dom.btnCopyReport) {
      dom.btnCopyReport.addEventListener('click', copyReportSummary);
    }

    // Download JSON Audit
    if (dom.btnExportJson) {
      dom.btnExportJson.addEventListener('click', exportReportJson);
    }

    // New Analysis Button
    if (dom.btnNewAnalysis) {
      dom.btnNewAnalysis.addEventListener('click', () => {
        dom.verifyTextarea.scrollIntoView({ behavior: 'smooth' });
        dom.verifyTextarea.focus();
      });
    }

    // Map Controls
    if (dom.btnZoomIn) {
      dom.btnZoomIn.addEventListener('click', () => {
        if (window.constellation) window.constellation.zoomIn();
      });
    }
    if (dom.btnZoomOut) {
      dom.btnZoomOut.addEventListener('click', () => {
        if (window.constellation) window.constellation.zoomOut();
      });
    }
    if (dom.btnResetGraph) {
      dom.btnResetGraph.addEventListener('click', () => {
        if (window.constellation) window.constellation.resetView();
      });
    }

    // Archetype "Put Under Lens" Buttons
    const archetypeBtns = document.querySelectorAll('.btn-archetype-inspect');
    archetypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPreset = btn.getAttribute('data-preset-target');
        if (targetPreset) {
          loadPreset(targetPreset);
          const workspaceEl = document.getElementById('workspace');
          if (workspaceEl) {
            workspaceEl.scrollIntoView({ behavior: 'smooth' });
          }
          dom.presetPills.forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-preset-id') === targetPreset);
          });
        }
      });
    });

    // Mobile Hamburger Menu
    if (dom.mobileMenuBtn && dom.navLinks) {
      dom.mobileMenuBtn.addEventListener('click', () => {
        const isHidden = dom.navLinks.style.display === 'none' || !dom.navLinks.style.display;
        dom.navLinks.style.display = isHidden ? 'flex' : 'none';
      });
    }

    // Backend Modal Controls
    if (dom.btnBackendModal) {
      dom.btnBackendModal.addEventListener('click', () => {
        refreshBackendModalStatus();
        if (dom.backendModalBackdrop) dom.backendModalBackdrop.style.display = 'flex';
      });
    }
    if (dom.btnCloseModal) {
      dom.btnCloseModal.addEventListener('click', () => {
        if (dom.backendModalBackdrop) dom.backendModalBackdrop.style.display = 'none';
      });
    }
    if (dom.backendModalBackdrop) {
      dom.backendModalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.backendModalBackdrop) {
          dom.backendModalBackdrop.style.display = 'none';
        }
      });
    }

    // Modal Status Refresh & Key Save
    if (dom.btnCheckStatus) {
      dom.btnCheckStatus.addEventListener('click', async () => {
        dom.btnCheckStatus.textContent = 'Checking...';
        if (window.ProofLensApi) {
          await window.ProofLensApi.checkBackendHealth();
          await window.ProofLensApi.getDatabaseStatus();
        }
        refreshBackendModalStatus();
        dom.btnCheckStatus.textContent = '🔄 Refresh Status';
      });
    }

    if (dom.btnSaveTinyFishKey) {
      dom.btnSaveTinyFishKey.addEventListener('click', async () => {
        const key = (dom.inputTinyFishKey.value || '').trim();
        if (!key) {
          showToast('Please enter a TinyFish API key.');
          return;
        }
        try {
          dom.btnSaveTinyFishKey.textContent = 'Connecting...';
          const res = await window.ProofLensApi.setTinyFishKey(key);
          if (res.success) {
            showToast('TinyFish API connected successfully!');
          } else {
            showToast('TinyFish Key saved. Verification test pending.');
          }
          refreshBackendModalStatus();
        } catch (e) {
          showToast('Failed to save key: ' + e.message);
        } finally {
          dom.btnSaveTinyFishKey.textContent = 'Save & Connect TinyFish ⚡';
        }
      });
    }

    // History Archive Controls
    if (dom.btnRefreshHistory) {
      dom.btnRefreshHistory.addEventListener('click', () => {
        fetchVerificationHistory(state.historyPage);
      });
    }
    if (dom.btnRetryHistory) {
      dom.btnRetryHistory.addEventListener('click', () => {
        fetchVerificationHistory(1);
      });
    }
    if (dom.btnPrevPage) {
      dom.btnPrevPage.addEventListener('click', () => {
        if (state.historyPage > 1) {
          fetchVerificationHistory(state.historyPage - 1);
        }
      });
    }
    if (dom.btnNextPage) {
      dom.btnNextPage.addEventListener('click', () => {
        if (state.historyPage < state.historyTotalPages) {
          fetchVerificationHistory(state.historyPage + 1);
        }
      });
    }

    // Listen for backend updates and report persistence
    window.addEventListener('prooflens:backend-update', (e) => {
      updateNavbarStatus(e.detail.available);
      refreshBackendModalStatus();
    });

    window.addEventListener('prooflens:report-persisted', (e) => {
      const persisted = e.detail.persisted;
      if (dom.dbPersistenceBadge) {
        if (persisted) {
          dom.dbPersistenceBadge.textContent = '⚡ Neon PostgreSQL (Saved)';
          dom.dbPersistenceBadge.className = 'db-pill-badge';
          dom.dbPersistenceBadge.title = 'Audit saved to persistent Neon PostgreSQL database.';
        } else {
          dom.dbPersistenceBadge.textContent = '💾 Local Memory (Database Pending)';
          dom.dbPersistenceBadge.className = 'db-pill-badge offline';
          dom.dbPersistenceBadge.title = e.detail.notice || 'Database offline';
        }
      }
      // Auto-refresh verification history
      fetchVerificationHistory(1);
    });
  }

  function updateNavbarStatus(isOnline) {
    if (!dom.backendDot || !dom.backendStatusLabel) return;
    if (isOnline) {
      dom.backendDot.classList.add('active');
      dom.backendStatusLabel.textContent = 'FastAPI + Neon DB';
    } else {
      dom.backendDot.classList.remove('active');
      dom.backendStatusLabel.textContent = 'Demo Engine';
    }
  }

  function refreshBackendModalStatus() {
    const isAvail = window.ProofLensApi ? window.ProofLensApi.backendAvailable : false;
    const tf = window.ProofLensApi ? window.ProofLensApi.tinyfishStatus : null;
    const db = window.ProofLensApi ? window.ProofLensApi.databaseStatus : null;

    if (dom.modalFastApiBadge) {
      if (isAvail) {
        dom.modalFastApiBadge.textContent = '● Online (FastAPI Port 8000)';
        dom.modalFastApiBadge.className = 'modal-status-badge active';
      } else {
        dom.modalFastApiBadge.textContent = '○ Offline (Run: python server.py)';
        dom.modalFastApiBadge.className = 'modal-status-badge inactive';
      }
    }

    if (dom.modalNeonDbBadge) {
      if (db && db.connected) {
        dom.modalNeonDbBadge.textContent = '● Connected to Neon PostgreSQL';
        dom.modalNeonDbBadge.className = 'modal-status-badge active';
      } else if (db && db.configured) {
        dom.modalNeonDbBadge.textContent = '○ Serverless Suspended / Unreachable';
        dom.modalNeonDbBadge.className = 'modal-status-badge inactive';
      } else {
        dom.modalNeonDbBadge.textContent = '○ Dormant (Configure DATABASE_URL in .env)';
        dom.modalNeonDbBadge.className = 'modal-status-badge';
      }
    }

    if (dom.modalDbDriverBadge) {
      dom.modalDbDriverBadge.textContent = 'SQLAlchemy 2.x • Neon SSL (require)';
    }

    if (dom.historyDbDot && dom.historyDbStatusText) {
      if (db && db.connected) {
        dom.historyDbDot.className = 'history-db-dot';
        dom.historyDbStatusText.textContent = 'Connected to Neon PostgreSQL';
      } else if (db && db.configured) {
        dom.historyDbDot.className = 'history-db-dot inactive';
        dom.historyDbStatusText.textContent = 'Neon DB Suspended / Connecting...';
      } else {
        dom.historyDbDot.className = 'history-db-dot inactive';
        dom.historyDbStatusText.textContent = 'Local Cache Mode (Add DATABASE_URL to .env)';
      }
    }

    if (dom.modalTinyFishBadge) {
      if (tf && tf.configured) {
        dom.modalTinyFishBadge.textContent = '● TinyFish API Active (Key Verified)';
        dom.modalTinyFishBadge.className = 'modal-status-badge active';
      } else {
        dom.modalTinyFishBadge.textContent = '● Live Search Fallback (Ready)';
        dom.modalTinyFishBadge.className = 'modal-status-badge';
      }
    }
  }

  function updateCharCount() {
    const len = (state.currentText || '').length;
    if (dom.charCount) {
      dom.charCount.textContent = `${len.toLocaleString()} characters`;
    }
  }

  function loadPreset(presetId) {
    if (!window.PROOFLENS_DATA || !window.PROOFLENS_DATA.presets) return;
    const preset = window.PROOFLENS_DATA.presets.find(p => p.id === presetId);
    if (!preset) return;

    state.activePresetId = presetId;
    state.currentText = preset.inputText;
    if (dom.verifyTextarea) {
      dom.verifyTextarea.value = preset.inputText;
    }
    updateCharCount();

    dom.presetPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-preset-id') === presetId);
    });

    showToast(`Loaded: ${preset.name}`);
  }

  function handleFileUpload(file) {
    state.attachedFile = file;
    if (dom.uploadText) {
      dom.uploadText.innerHTML = `<strong>Attached Paper:</strong> ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
    showToast(`Attached reference document: ${file.name}`);
  }

  /**
   * Normalizes report DTO whether retrieved from live analysis or database
   */
  function normalizeReportDto(report) {
    if (!report) return null;
    const norm = { ...report };

    if (!norm.summary && norm.resultMetadata && norm.resultMetadata.summaryMetrics) {
      norm.summary = norm.resultMetadata.summaryMetrics;
    }
    if (!norm.summary) {
      const claims = norm.claims || [];
      const supported = claims.filter(c => c.status === 'SUPPORTED').length;
      const partial = claims.filter(c => c.status === 'PARTIALLY_SUPPORTED').length;
      const contradicted = claims.filter(c => c.status === 'CONTRADICTED' || c.status === 'OUTDATED').length;
      const unverified = claims.filter(c => c.status === 'UNVERIFIED').length;
      const conflicting = claims.filter(c => c.status === 'CONFLICTING_EVIDENCE').length;
      norm.summary = {
        totalClaims: claims.length,
        supportedCount: supported,
        partiallySupportedCount: partial,
        contradictedCount: contradicted,
        unverifiedCount: unverified,
        conflictingCount: conflicting,
        overallCredibilityScore: Math.round(norm.confidenceScore || 75)
      };
    }
    if (!norm.timestamp && norm.createdAt) {
      norm.timestamp = norm.createdAt;
    }
    if (!norm.originalText && norm.submittedText) {
      norm.originalText = norm.submittedText;
    }
    if (!norm.metadata) {
      norm.metadata = norm.resultMetadata || {};
    }
    return norm;
  }

  /**
   * Renders a verified or loaded report into the UI dashboard
   */
  function displayReport(report, isSilent = false) {
    const normalized = normalizeReportDto(report);
    state.currentReport = normalized;
    state.selectedClaimId = normalized.claims && normalized.claims[0] ? normalized.claims[0].id : null;

    if (dom.resultsDashboard) {
      dom.resultsDashboard.style.display = 'block';
    }

    // Persistence Badge Update
    if (dom.dbPersistenceBadge) {
      if (normalized._dbPersisted || normalized.source === 'neon_postgresql' || (normalized.id && !normalized.id.startsWith('np_demo_'))) {
        dom.dbPersistenceBadge.textContent = '⚡ Neon PostgreSQL (Stored)';
        dom.dbPersistenceBadge.className = 'db-pill-badge';
      } else {
        dom.dbPersistenceBadge.textContent = '💾 Memory Cache';
        dom.dbPersistenceBadge.className = 'db-pill-badge offline';
      }
    }

    // Engine Badge
    if (dom.demoDataBadge) {
      if (!normalized.isDemoMode) {
        const isTf = normalized.metadata && normalized.metadata.tinyfish_configured;
        dom.demoDataBadge.textContent = isTf ? '🟢 LIVE TINYFISH EVIDENCE' : '🟢 VERIFIED GROUND TRUTH';
        dom.demoDataBadge.style.background = 'var(--status-supported-bg)';
        dom.demoDataBadge.style.color = 'var(--status-supported)';
        dom.demoDataBadge.style.borderColor = 'rgba(35, 122, 82, 0.4)';
      } else {
        dom.demoDataBadge.textContent = 'BENCHMARK DATA';
        dom.demoDataBadge.style.background = '';
        dom.demoDataBadge.style.color = '';
        dom.demoDataBadge.style.borderColor = '';
      }
    }

    // Report Header
    if (dom.reportDate) {
      const d = new Date(normalized.timestamp || Date.now());
      dom.reportDate.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (dom.reportClaimsCount) {
      dom.reportClaimsCount.textContent = `${(normalized.claims || []).length} claims identified`;
    }

    // Render Metrics
    renderMetrics(normalized.summary);

    // Render Left Column Claims
    renderClaimsList();

    // Render Right Column Sticky Inspector
    if (normalized.claims && normalized.claims[0]) {
      renderInspector(normalized.claims[0]);
    }

    // Sync with Evidence Map
    if (window.constellation) {
      window.constellation.loadReportData(normalized);
    }

    if (!isSilent) {
      dom.resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Executes verification pipeline
   */
  async function executeVerification(isInitialSilent = false) {
    if (state.isAnalyzing) return;

    if (!state.currentText || state.currentText.trim().length === 0) {
      showToast('Please enter an AI answer or select a sample.');
      if (dom.verifyTextarea) dom.verifyTextarea.focus();
      return;
    }

    state.isAnalyzing = true;

    // Show Progress Scanner
    if (dom.analysisProgress) dom.analysisProgress.style.display = 'block';
    if (!isInitialSilent) {
      dom.analysisProgress.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Trigger lens pulse
    if (window.heroLens && !isInitialSilent) {
      window.heroLens.triggerVerificationPulse();
    }

    try {
      const report = await window.ProofLensApi.analyzeText(
        state.currentText,
        state.attachedFile,
        (progress) => {
          updateProgressStage(progress.stage, progress.label);
        }
      );

      state.isAnalyzing = false;
      if (dom.analysisProgress) dom.analysisProgress.style.display = 'none';

      displayReport(report, isInitialSilent);

      if (!isInitialSilent) {
        showToast('Verification audit compiled & saved.');
      }

    } catch (err) {
      console.error('[ProofLens] Error during analysis:', err);
      state.isAnalyzing = false;
      if (dom.analysisProgress) dom.analysisProgress.style.display = 'none';
      showToast('Verification halted: ' + err.message);
    }
  }

  function updateProgressStage(stageNumber, label) {
    if (dom.scannerStageLabel) {
      dom.scannerStageLabel.textContent = label;
    }

    dom.stagePills.forEach((pill, idx) => {
      const pillStage = idx + 1;
      pill.classList.remove('active', 'completed');
      if (pillStage < stageNumber) {
        pill.classList.add('completed');
      } else if (pillStage === stageNumber) {
        pill.classList.add('active');
      }
    });
  }

  function renderMetrics(summary) {
    if (!summary) return;
    if (dom.metricTotal) dom.metricTotal.textContent = summary.totalClaims || 0;
    if (dom.metricSupported) dom.metricSupported.textContent = summary.supportedCount || 0;
    if (dom.metricPartial) dom.metricPartial.textContent = summary.partiallySupportedCount || 0;
    if (dom.metricContradicted) dom.metricContradicted.textContent = summary.contradictedCount || 0;
    if (dom.metricUnverified) dom.metricUnverified.textContent = (summary.unverifiedCount || 0) + (summary.conflictingCount || 0);
  }

  function renderClaimsList() {
    if (!dom.claimsList || !state.currentReport) return;
    const claims = state.currentReport.claims || [];

    const filtered = claims.filter(c => {
      if (state.activeFilter === 'ALL') return true;
      if (state.activeFilter === 'SUPPORTED') return c.status === 'SUPPORTED';
      if (state.activeFilter === 'PARTIALLY_SUPPORTED') return c.status === 'PARTIALLY_SUPPORTED' || c.status === 'CONFLICTING_EVIDENCE';
      if (state.activeFilter === 'CONTRADICTED') return c.status === 'CONTRADICTED' || c.status === 'OUTDATED';
      if (state.activeFilter === 'UNVERIFIED') return c.status === 'UNVERIFIED';
      return true;
    });

    if (filtered.length === 0) {
      dom.claimsList.innerHTML = `
        <div style="padding:32px 16px; text-align:center; color:var(--color-secondary-text); font-family:var(--font-mono); font-size:0.875rem;">
          No claims matched filter: <strong>${state.activeFilter}</strong>
        </div>
      `;
      return;
    }

    dom.claimsList.innerHTML = filtered.map((claim, idx) => {
      const isSelected = claim.id === state.selectedClaimId;
      const statusClass = (claim.status || '').toLowerCase();
      const statusLabel = claim.statusLabel || claim.status.replace('_', ' ');

      return `
        <div class="claim-card ${statusClass} ${isSelected ? 'active-claim' : ''}" 
             data-claim-id="${claim.id}" 
             onclick="window.selectClaim('${claim.id}')">
          <div class="claim-card-top">
            <span class="claim-number">CLAIM #${idx + 1}</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="claim-status-badge ${statusClass}">${statusLabel}</span>
              <span class="claim-confidence">${claim.confidence}% confidence</span>
            </div>
          </div>
          
          <div class="claim-text">
            “${escapeHtml(claim.claimText)}”
          </div>

          <div class="claim-source-preview">
            <span class="source-icon">🏛️</span>
            <span class="source-name">${escapeHtml(claim.source ? claim.source.publisher : 'Unknown Source')}</span>
            <span style="color:var(--color-secondary-text);">•</span>
            <span style="color:var(--color-secondary-text);">${escapeHtml(claim.source && claim.source.date ? claim.source.date : 'Indexed')}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderInspector(claim) {
    if (!dom.inspectorPanel) return;

    if (!claim) {
      dom.inspectorPanel.innerHTML = `
        <div style="padding:48px 24px; text-align:center; color:var(--color-secondary-text);">
          Select a claim card on the left to inspect ground-truth evidence.
        </div>
      `;
      return;
    }

    const statusClass = (claim.status || '').toLowerCase();
    const statusLabel = claim.statusLabel || claim.status.replace('_', ' ');

    dom.inspectorPanel.innerHTML = `
      <div class="inspector-header">
        <span class="inspector-badge ${statusClass}">
          ● ${statusLabel}
        </span>
        <span class="inspector-confidence">
          Confidence Calibrated: ${claim.confidence}%
        </span>
      </div>

      <div class="inspector-section">
        <div class="inspector-section-title">Claim Statement</div>
        <div class="inspector-claim-text font-display">
          “${escapeHtml(claim.claimText)}”
        </div>
      </div>

      <div class="inspector-section">
        <div class="inspector-section-title">Forensic Reasoning & Truth Assessment</div>
        <p class="inspector-explanation-text">
          ${escapeHtml(claim.explanation)}
        </p>
      </div>

      ${claim.source ? `
        <div class="inspector-section">
          <div class="inspector-section-title">Primary Corroborating Source</div>
          <div class="source-document-card">
            <div class="source-doc-publisher">${escapeHtml(claim.source.publisher)}</div>
            <div class="source-doc-title">${escapeHtml(claim.source.title)}</div>
            
            <div class="source-doc-meta">
              <span>📅 ${escapeHtml(claim.source.date || '2024')}</span>
              <span>🔗 ${claim.source.doi ? escapeHtml(claim.source.doi) : 'Indexed Reference'}</span>
            </div>

            ${claim.source.passage ? `
              <div class="source-doc-passage">
                ${escapeHtml(claim.source.passage)}
              </div>
            ` : ''}

            <a href="${claim.source.url || 'https://scholar.google.com'}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="source-doc-link">
              Inspect Authoritative Publication ↗
            </a>
          </div>
        </div>
      ` : `
        <div class="inspector-section">
          <div class="inspector-section-title">Evidence Status</div>
          <p class="inspector-explanation-text" style="color:var(--color-secondary-text);">
            No direct peer-reviewed or authoritative evidence was indexed for this statement.
          </p>
        </div>
      `}
    `;
  }

  /**
   * Fetches verification history from Neon PostgreSQL
   */
  async function fetchVerificationHistory(page = 1) {
    if (!dom.historyGrid) return;

    state.isLoadingHistory = true;
    state.historyPage = page;

    if (dom.historyLoadingState) dom.historyLoadingState.style.display = 'block';
    if (dom.historyErrorState) dom.historyErrorState.style.display = 'none';
    if (dom.historyEmptyState) dom.historyEmptyState.style.display = 'none';
    if (dom.historyGrid) dom.historyGrid.style.display = 'none';
    if (dom.historyPagination) dom.historyPagination.style.display = 'none';

    try {
      const data = await window.ProofLensApi.getReportHistory(page, state.historyPageSize);
      state.isLoadingHistory = false;
      if (dom.historyLoadingState) dom.historyLoadingState.style.display = 'none';

      const reports = data.reports || [];
      state.historyReports = reports;
      state.historyTotalCount = data.totalCount || reports.length;
      state.historyTotalPages = data.totalPages || 1;

      if (reports.length === 0) {
        if (dom.historyEmptyState) dom.historyEmptyState.style.display = 'block';
        return;
      }

      renderHistoryCards(reports);

      if (dom.historyGrid) dom.historyGrid.style.display = 'grid';
      if (dom.historyPagination) dom.historyPagination.style.display = 'flex';

      // Update Pagination Buttons
      if (dom.btnPrevPage) dom.btnPrevPage.disabled = state.historyPage <= 1;
      if (dom.btnNextPage) dom.btnNextPage.disabled = state.historyPage >= state.historyTotalPages;
      if (dom.paginationInfo) {
        dom.paginationInfo.textContent = `Page ${state.historyPage} of ${state.historyTotalPages} (${state.historyTotalCount} total)`;
      }

    } catch (err) {
      console.warn('[ProofLens] History fetch error:', err);
      state.isLoadingHistory = false;
      if (dom.historyLoadingState) dom.historyLoadingState.style.display = 'none';
      if (dom.historyErrorState) {
        dom.historyErrorState.style.display = 'block';
        if (dom.historyErrorMessage) {
          dom.historyErrorMessage.textContent = err.message || 'Unable to load verification records.';
        }
      }
    }
  }

  /**
   * Renders history cards into the grid
   */
  function renderHistoryCards(reports) {
    if (!dom.historyGrid) return;

    dom.historyGrid.innerHTML = reports.map(r => {
      const dateStr = r.createdAt || r.created_at || r.timestamp;
      const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : 'Recently';

      const verdict = (r.overallVerdict || r.overall_verdict || 'insufficient_evidence').toLowerCase();
      const verdictLabel = verdict.replace('_', ' ');
      const submittedText = r.submittedText || r.submitted_text || r.originalText || '';
      const claimsCount = r.claimsCount || r.claims_count || (r.claims ? r.claims.length : 0);
      const confidence = Math.round(r.confidenceScore || r.confidence_score || (r.summary ? r.summary.overallCredibilityScore : 75));

      return `
        <div class="history-card" id="hist_card_${r.id}">
          <div>
            <div class="history-card-header">
              <span class="history-card-id">ID: ${escapeHtml(r.id)}</span>
              <span class="history-card-date">${formattedDate}</span>
            </div>

            <div class="history-card-body">
              <div class="history-card-text">
                “${escapeHtml(submittedText)}”
              </div>

              <div class="history-card-metrics">
                <span class="history-verdict-badge ${verdict}">${verdictLabel}</span>
                <span class="history-metric-chip">🔍 ${claimsCount} claims</span>
                <span class="history-metric-chip">⚖️ ${confidence}% credibility</span>
              </div>
            </div>
          </div>

          <div class="history-card-footer">
            <button class="btn-history-inspect" onclick="window.loadAuditReport('${r.id}')" type="button">
              Inspect in Observatory ↗
            </button>
            <button class="btn-history-delete" onclick="window.deleteAuditReport('${r.id}')" type="button" title="Delete audit">
              Delete ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Globally exposed: load an audit report from Neon PostgreSQL
  window.loadAuditReport = async function (reportId) {
    showToast(`Retrieving audit '${reportId}' from Neon PostgreSQL...`);
    try {
      const report = await window.ProofLensApi.getReportById(reportId);
      displayReport(report, false);
      showToast('Audit report loaded successfully.');
    } catch (e) {
      showToast('Failed to load report: ' + e.message);
    }
  };

  // Globally exposed: delete an audit report
  window.deleteAuditReport = async function (reportId) {
    if (!confirm(`Are you sure you want to delete audit '${reportId}' from Neon PostgreSQL?`)) {
      return;
    }
    try {
      await window.ProofLensApi.deleteReport(reportId);
      showToast(`Audit '${reportId}' removed.`);
      fetchVerificationHistory(state.historyPage);
    } catch (e) {
      showToast('Failed to delete report: ' + e.message);
    }
  };

  // Globally exposed for claim selection
  window.selectClaim = function (claimId) {
    state.selectedClaimId = claimId;
    renderClaimsList();
    if (state.currentReport && state.currentReport.claims) {
      const claim = state.currentReport.claims.find(c => c.id === claimId);
      if (claim) renderInspector(claim);
    }
  };

  function copyReportSummary() {
    if (!state.currentReport) return;
    const r = state.currentReport;
    const text = `PROOFLENS AI — EVIDENCE VERIFICATION AUDIT
Report ID: ${r.id}
Date: ${r.timestamp}
Identified Claims: ${r.summary ? r.summary.totalClaims : (r.claims || []).length}
Overall Credibility: ${r.summary ? r.summary.overallCredibilityScore : 85}%

SUMMARY OF VERIFIED CLAIMS:
${(r.claims || []).map((c, i) => `${i + 1}. [${c.status}] ${c.claimText}\n   Source: ${c.source ? c.source.publisher + ' - ' + c.source.title : 'None'}`).join('\n\n')}

"Don't Just Trust AI. Verify It."`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Audit report copied to clipboard.');
    }).catch(() => {
      showToast('Could not automatically copy report.');
    });
  }

  function exportReportJson() {
    if (!state.currentReport) return;
    const blob = new Blob([JSON.stringify(state.currentReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prooflens-verification-${state.currentReport.id || 'report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON verification report.');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    const existing = document.querySelector('.editorial-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'editorial-toast';
    toast.innerHTML = `<span>⬡</span> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // Startup initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

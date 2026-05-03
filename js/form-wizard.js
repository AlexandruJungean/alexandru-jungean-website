(function () {
  'use strict';

  const STORAGE_KEY = 'intake_form_draft';
  const SERVICE_STEP_MAP = {
    website: 'website-details',
    mobile_app: 'mobile-app-details',
    branding: 'branding-details',
    marketing: 'marketing-details',
    video: 'video-details',
    database: 'database-details',
    design: 'design-details',
    consulting: 'consulting-details'
  };
  const STEP_LABELS = {
    'intro': 'Getting started',
    'about-you': 'About You',
    'services': 'What Do You Need',
    'about-project': 'About Your Project',
    'current-situation': 'Current Situation',
    'website-details': 'Website Details',
    'mobile-app-details': 'Mobile App Details',
    'branding-details': 'Branding & Identity',
    'marketing-details': 'Marketing & Ads',
    'video-details': 'Video Production',
    'database-details': 'Database & Backend',
    'design-details': 'UI/UX Design',
    'consulting-details': 'Strategy & Consulting',
    'working-together': 'Working Together',
    'summary': 'Review & Submit'
  };

  const SMART_SUGGESTIONS = [
    { if: ['marketing'], not: ['website'], msg: 'Ad campaigns need a destination. Do you have a website, or should we build one?', add: 'website' },
    { if: ['branding'], not: ['website'], msg: 'A fresh brand looks best on a matching website. Add Website?', add: 'website' },
    { if: ['website', 'branding'], not: [], msg: "Great combo - I'll design your website to match your brand identity perfectly.", positive: true },
    { if: ['consulting'], only: true, msg: "I'll help you figure out the right direction. You can always add specific services later.", positive: true }
  ];

  const PRESELECTIONS = {
    'Leads & Sales': { ws_features: ['Contact form', 'SEO optimization', 'Google Analytics', 'Newsletter signup'], ma_features: ['Push notifications', 'Analytics', 'User auth'], mk_services: ['Meta Ads', 'SEO', 'Marketing strategy'] },
    'Brand & Credibility': { ws_features: ['Image gallery / Portfolio', 'Social media integration', 'Blog / Articles', 'Responsive design'], br_needs: ['Full brand identity', 'Social media templates'] },
    'Conversions & Actions': { ws_features: ['User authentication', 'Payment / E-commerce', 'Google Analytics', 'Contact form'] },
    'Presentation & Information': { ws_features: ['SEO optimization', 'Blog / Articles', 'Responsive design'] },
    'Efficiency & Automation': { db_needs: ['CRM / Lead management', 'Admin dashboard', 'Automation / Integrations', 'Reporting / Analytics'] },
    'Online Sales / E-commerce': { ws_features: ['Payment / E-commerce', 'User authentication', 'Search functionality', 'Google Analytics'], ma_features: ['Payments', 'Push notifications', 'User auth', 'Search with filters'] }
  };

  const WS_TYPE_PRESELECTIONS = {
    'E-commerce': ['Payment / E-commerce', 'User authentication', 'Search functionality', 'Google Analytics'],
    'Government / Institutional': ['Multilingual', 'Accessibility (WCAG)', 'Document upload', 'Search functionality'],
    'Landing page': ['Contact form', 'Google Analytics', 'Social media integration'],
    'Web application (SaaS/dashboard)': ['User authentication', 'Admin panel / CMS', 'API integrations', 'Google Analytics'],
    'Portfolio / Personal': ['Image gallery / Portfolio', 'SEO optimization', 'Social media integration', 'Responsive design']
  };

  /* =========================================
     FormWizard
     ========================================= */
  class FormWizard {
    constructor() {
      this.form = document.getElementById('intake-form');
      this.allStepEls = document.querySelectorAll('.wizard-step');
      this.currentIndex = 0;
      this.uploadedFiles = [];
      this.preselectedFeatures = new Set();

      this.prevBtn = document.getElementById('wizard-prev');
      this.nextBtn = document.getElementById('wizard-next');
      this.submitBtn = document.getElementById('wizard-submit');
      this.progressFill = document.getElementById('wizard-progress-fill');
      this.stepLabel = document.getElementById('wizard-step-label');
      this.stepCount = document.getElementById('wizard-step-count');
      this.priorityBadge = document.getElementById('priority-badge');
      this.priorityBadgeText = document.getElementById('priority-badge-text');

      this.initRepeaters();
      this.initCustomSelects();
      this.initCustomMultiSelects();
      this.initFileUpload();
      this.initConditionalFields();
      this.initServiceCards();
      this.initPriorityCards();
      this.initAssetConditionals();
      this.initAutoSave();
      this.initConsentToggle();
      this.bindNav();
      this.restore();
      this.render();
    }

    /* --- GDPR Consent → Submit Button Toggle --- */
    initConsentToggle() {
      var self = this;
      var consent = document.getElementById('gdpr-consent');
      var tooltip = document.getElementById('wizard-submit-tooltip');
      var wrap = document.getElementById('wizard-submit-wrap');
      if (!consent) return;

      consent.addEventListener('change', function () {
        self.submitBtn.disabled = !consent.checked;
        if (tooltip) tooltip.hidden = consent.checked;
      });

      if (wrap) {
        wrap.addEventListener('mouseenter', function () {
          if (self.submitBtn.disabled && tooltip) tooltip.classList.add('is-visible');
        });
        wrap.addEventListener('mouseleave', function () {
          if (tooltip) tooltip.classList.remove('is-visible');
        });
      }

      if (wrap) {
        wrap.addEventListener('click', function () {
          if (self.submitBtn.disabled) {
            var consentField = consent.closest('.summary-consent');
            if (consentField) {
              consentField.classList.add('wz-shake');
              consentField.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(function () { consentField.classList.remove('wz-shake'); }, 600);
            }
          } else {
            self.submit();
          }
        });
      }
    }

    /* --- Auto-save on every field change --- */
    initAutoSave() {
      var self = this;
      var saveTimeout;
      function debouncedSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function () { self.save(); }, 300);
      }
      this.form.addEventListener('input', debouncedSave);
      this.form.addEventListener('change', debouncedSave);
    }

    /* --- Dynamic Step List --- */
    get steps() {
      var base = ['intro', 'about-you', 'services', 'about-project', 'current-situation'];
      var selected = this.getSelectedServices();
      var order = ['website', 'mobile_app', 'branding', 'marketing', 'video', 'database', 'design', 'consulting'];
      order.forEach(function (s) {
        if (selected.indexOf(s) !== -1) base.push(SERVICE_STEP_MAP[s]);
      });
      base.push('working-together', 'summary');
      return base;
    }

    getSelectedServices() {
      var checks = this.form.querySelectorAll('input[name="services"]:checked');
      var vals = [];
      checks.forEach(function (c) { vals.push(c.value); });
      return vals;
    }

    /* --- Navigation --- */
    bindNav() {
      var self = this;
      this.prevBtn.addEventListener('click', function () { self.prev(); });
      this.nextBtn.addEventListener('click', function () { self.next(); });
      document.getElementById('wizard-clear').addEventListener('click', function () {
        if (confirm('Clear all data and start over?')) {
          localStorage.removeItem(STORAGE_KEY);
          self.form.reset();
          self.uploadedFiles = [];
          document.getElementById('upload-file-list').innerHTML = '';
          self.currentIndex = 0;
          self.clearAllConditionals();
          self.render();
        }
      });
    }

    next() {
      if (!this.validateCurrentStep()) return;
      this.save();
      if (this.currentIndex < this.steps.length - 1) {
        this.currentIndex++;
        if (this.steps[this.currentIndex] === 'summary') this.buildSummary();
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    prev() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    goToStep(stepId) {
      var idx = this.steps.indexOf(stepId);
      if (idx !== -1) {
        this.currentIndex = idx;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    render() {
      var steps = this.steps;
      var current = steps[this.currentIndex];
      var self = this;

      this.allStepEls.forEach(function (el) {
        var id = el.getAttribute('data-step');
        if (id === current) { el.hidden = false; } else { el.hidden = true; }
      });

      var isFirst = this.currentIndex === 0;
      var isLast = current === 'summary';
      var isSuccess = current === 'success';

      this.prevBtn.hidden = isFirst || isSuccess;
      this.nextBtn.hidden = isLast || isSuccess;
      this.submitBtn.hidden = !isLast || isSuccess;
      if (isLast) {
        var consent = document.getElementById('gdpr-consent');
        this.submitBtn.disabled = consent ? !consent.checked : false;
      }
      document.getElementById('wizard-nav').hidden = isSuccess;
      document.getElementById('wizard-progress').hidden = isSuccess;
      document.querySelector('.wizard-footer-actions').hidden = isFirst || isSuccess;

      if (isFirst) {
        this.nextBtn.innerHTML = "Let's Start <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>";
      } else {
        this.nextBtn.innerHTML = "Next <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>";
      }

      var pct = Math.round(((this.currentIndex + 1) / steps.length) * 100);
      this.progressFill.style.width = pct + '%';
      this.stepLabel.textContent = STEP_LABELS[current] || '';
      this.stepCount.textContent = 'Step ' + (this.currentIndex + 1) + ' of ' + steps.length;

      this.updateDbBudgetVisibility();
      this.updatePriorityBadge();

      if (current === 'services') this.updateServiceSuggestions();
      if (current === 'website-details') {
        this.applySmartPreselections();
        this.checkWebsiteWarnings();
      }
    }

    /* --- Validation --- */
    validateCurrentStep() {
      var stepId = this.steps[this.currentIndex];
      if (stepId === 'intro') return true;

      var stepEl = this.form.querySelector('[data-step="' + stepId + '"]');
      if (!stepEl) return true;

      this.clearErrors(stepEl);
      var valid = true;

      if (stepId === 'services') {
        if (this.getSelectedServices().length === 0) {
          this.showStepError(stepEl, 'Please select at least one service.');
          valid = false;
        }
        return valid;
      }

      var requiredInputs = stepEl.querySelectorAll('[required]');
      requiredInputs.forEach(function (input) {
        if (input.closest('[hidden]')) return;
        if (input.type === 'radio') {
          var name = input.name;
          var group = stepEl.querySelectorAll('input[name="' + name + '"]');
          var anyChecked = false;
          group.forEach(function (r) { if (r.checked) anyChecked = true; });
          if (!anyChecked) {
            input.closest('.wz-field').classList.add('wz-field-has-error');
            valid = false;
          }
        } else if (!input.value.trim()) {
          input.classList.add('wz-field-error');
          valid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          input.classList.add('wz-field-error');
          valid = false;
        }
      });

      if (stepId === 'summary') {
        var consent = document.getElementById('gdpr-consent');
        if (!consent.checked) {
          consent.closest('.wz-field').classList.add('wz-field-has-error');
          valid = false;
        }
      }

      if (!valid) {
        var firstError = stepEl.querySelector('.wz-field-error, .wz-field-has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return valid;
    }

    clearErrors(container) {
      container.querySelectorAll('.wz-field-error').forEach(function (el) { el.classList.remove('wz-field-error'); });
      container.querySelectorAll('.wz-field-has-error').forEach(function (el) { el.classList.remove('wz-field-has-error'); });
      container.querySelectorAll('.wz-error-msg').forEach(function (el) { el.remove(); });
    }

    showStepError(stepEl, msg) {
      var existing = stepEl.querySelector('.wz-error-msg');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.className = 'wz-error-msg';
      div.textContent = msg;
      stepEl.querySelector('.wizard-step-body').prepend(div);
    }

    /* --- Conditional Fields (select → show/hide) --- */
    initConditionalFields() {
      var self = this;
      this.form.querySelectorAll('[data-conditional]').forEach(function (select) {
        select.addEventListener('change', function () { self.handleConditional(this); });
      });
      this.form.querySelectorAll('[data-show-for-select]').forEach(function (el) {
        var selectName = el.getAttribute('data-show-for-select');
        var showVal = el.getAttribute('data-show-value');
        var select = self.form.querySelector('[name="' + selectName + '"]');
        if (select) {
          select.addEventListener('change', function () {
            el.hidden = select.value !== showVal;
          });
        }
      });
    }

    handleConditional(select) {
      var groups = this.form.querySelectorAll('[data-show-for="' + select.name + '"]');
      groups.forEach(function (g) {
        var vals = g.getAttribute('data-show-values').split('|');
        g.hidden = vals.indexOf(select.value) === -1;
      });
    }

    clearAllConditionals() {
      this.form.querySelectorAll('.wz-conditional-group, .wz-conditional-field, .wz-conditional-asset, .wz-custom-input').forEach(function (el) {
        el.hidden = true;
      });
      this.form.querySelectorAll('.pcard-followup').forEach(function (el) { el.hidden = true; });
      document.getElementById('priority-badge').hidden = true;
    }

    /* --- Custom Select (add custom option) --- */
    initCustomSelects() {
      var self = this;
      this.form.querySelectorAll('select[data-custom-option]').forEach(function (select) {
        var last = document.createElement('option');
        last.value = '__custom__';
        last.textContent = '+ Add custom...';
        select.appendChild(last);

        var customInput = select.parentElement.querySelector('.wz-custom-input');
        if (!customInput) return;

        select.addEventListener('change', function () {
          if (select.value === '__custom__') {
            customInput.hidden = false;
            customInput.focus();
          } else {
            customInput.hidden = true;
          }
          self.save();
        });
      });
    }

    /* --- Multi-Select Custom "+" Button --- */
    initCustomMultiSelects() {
      var self = this;

      function addCustomTag(btn, input) {
        var val = input.value.trim();
        if (!val) return;
        var field = btn.closest('.mtag-field');
        var name = field.querySelector('input[type="checkbox"]').name;
        var optionsDiv = field.querySelector('.mtag-options');
        var label = document.createElement('label');
        label.className = 'mtag-opt mtag-opt-custom';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = name;
        cb.value = val;
        cb.checked = true;
        var span = document.createElement('span');
        span.textContent = val;
        label.appendChild(cb);
        label.appendChild(span);
        optionsDiv.appendChild(label);
        input.value = '';
        input.hidden = true;
        self.save();
      }

      this.form.querySelectorAll('.mtag-add-btn').forEach(function (btn) {
        var wrap = btn.closest('.mtag-custom-wrap');
        var input = wrap.querySelector('.mtag-custom-input');
        if (!input) return;

        btn.addEventListener('click', function () {
          if (input.value.trim()) {
            addCustomTag(btn, input);
          } else if (input.hidden) {
            input.hidden = false;
            input.focus();
          } else {
            input.hidden = true;
          }
        });

        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCustomTag(btn, input);
          }
        });
      });

      this.form.querySelectorAll('.mtag-opt-none input').forEach(function (cb) {
        cb.addEventListener('change', function () {
          if (cb.checked) {
            var field = cb.closest('.mtag-field');
            field.querySelectorAll('.mtag-opt:not(.mtag-opt-none) input').forEach(function (other) {
              other.checked = false;
            });
          }
        });
      });

      this.form.querySelectorAll('.mtag-opt:not(.mtag-opt-none) input').forEach(function (cb) {
        cb.addEventListener('change', function () {
          if (cb.checked) {
            var field = cb.closest('.mtag-field');
            if (!field) return;
            var noneOpt = field.querySelector('.mtag-opt-none input');
            if (noneOpt) noneOpt.checked = false;
          }
        });
      });
    }

    /* --- Repeater Fields --- */
    initRepeaters() {
      var self = this;
      document.querySelectorAll('.repeater').forEach(function (rep) {
        var addBtn = rep.querySelector('.repeater-add-btn');
        var rowsContainer = rep.querySelector('.repeater-rows');
        var max = parseInt(rep.getAttribute('data-max') || '5', 10);
        var templateId = rep.id === 'rep-competitors' ? 'tpl-competitor' : 'tpl-reference';
        var tpl = document.getElementById(templateId);

        addBtn.addEventListener('click', function () {
          if (rowsContainer.children.length >= max) return;
          var clone = tpl.content.cloneNode(true);
          var row = clone.querySelector('.repeater-row');
          row.querySelector('.repeater-remove-btn').addEventListener('click', function () {
            row.remove();
            if (rowsContainer.children.length < max) addBtn.hidden = false;
            self.save();
          });
          rowsContainer.appendChild(clone);
          if (rowsContainer.children.length >= max) addBtn.hidden = true;
        });

        if (rowsContainer.children.length === 0) addBtn.click();
      });
    }

    /* --- Service Cards --- */
    initServiceCards() {
      var self = this;
      var otherTextarea = this.form.querySelector('[data-show-when-service="other"]');
      this.form.querySelectorAll('input[name="services"]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          if (otherTextarea) {
            var otherCb = self.form.querySelector('input[name="services"][value="other"]');
            otherTextarea.hidden = !otherCb.checked;
          }
          self.save();
        });
      });
    }

    /* --- Priority Cards --- */
    initPriorityCards() {
      var self = this;
      this.form.querySelectorAll('input[name="priority_metric"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          document.querySelectorAll('.pcard-followup').forEach(function (f) { f.hidden = true; });
          var pcard = radio.closest('.pcard');
          var followup = pcard.querySelector('.pcard-followup');
          if (followup) followup.hidden = false;
          self.updatePriorityBadge();
          self.save();
        });
      });
    }

    updatePriorityBadge() {
      var checked = this.form.querySelector('input[name="priority_metric"]:checked');
      if (checked) {
        var text = checked.value;
        var targets = [];
        var pcard = checked.closest('.pcard');
        pcard.querySelectorAll('.pcard-followup input').forEach(function (inp) {
          if (inp.value) targets.push(inp.value);
        });
        this.priorityBadgeText.textContent = text + (targets.length ? ' - ' + targets.join(', ') : '');
        this.priorityBadge.hidden = false;
      } else {
        this.priorityBadge.hidden = true;
      }
    }

    /* --- Asset Conditionals (Section 4) --- */
    initAssetConditionals() {
      var self = this;
      var container = document.getElementById('mt-existing-assets');
      if (!container) return;
      container.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var val = cb.value;
          var cond = document.querySelector('.wz-conditional-asset[data-asset="' + val + '"]');
          if (cond) cond.hidden = !cb.checked;

          if (val === 'Nothing yet' && cb.checked) {
            container.querySelectorAll('.mtag-opt:not(.mtag-opt-none) input').forEach(function (other) {
              other.checked = false;
              var c = document.querySelector('.wz-conditional-asset[data-asset="' + other.value + '"]');
              if (c) c.hidden = true;
            });
          } else if (val !== 'Nothing yet' && cb.checked) {
            var noneOpt = container.querySelector('.mtag-opt-none input');
            if (noneOpt) noneOpt.checked = false;
          }
          self.save();
        });
      });
    }

    /* --- File Upload --- */
    initFileUpload() {
      var self = this;
      var zone = document.getElementById('upload-zone');
      var input = document.getElementById('file-input');
      var list = document.getElementById('upload-file-list');
      var browseBtn = zone.querySelector('.upload-browse-btn');

      browseBtn.addEventListener('click', function (e) { e.stopPropagation(); input.click(); });
      zone.addEventListener('click', function () { input.click(); });
      zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('is-dragover'); });
      zone.addEventListener('dragleave', function () { zone.classList.remove('is-dragover'); });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('is-dragover');
        self.handleFiles(e.dataTransfer.files);
      });
      input.addEventListener('change', function () {
        self.handleFiles(input.files);
        input.value = '';
      });
    }

    handleFiles(fileList) {
      var self = this;
      var list = document.getElementById('upload-file-list');
      var maxFiles = 20;
      var maxTotal = 100 * 1024 * 1024;

      Array.from(fileList).forEach(function (file) {
        if (self.uploadedFiles.length >= maxFiles) return;
        var totalSize = self.uploadedFiles.reduce(function (sum, f) { return sum + f.size; }, 0);
        if (totalSize + file.size > maxTotal) return;

        var id = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        self.uploadedFiles.push({ id: id, name: file.name, size: file.size, file: file, url: null, status: 'pending' });
        self.renderFileItem(id, file.name, file.size);
        self.uploadFile(id, file);
      });
    }

    renderFileItem(id, name, size) {
      var list = document.getElementById('upload-file-list');
      var div = document.createElement('div');
      div.className = 'upload-file-item';
      div.id = 'ufi-' + id;
      var sizeStr = size < 1024 * 1024 ? (size / 1024).toFixed(0) + ' KB' : (size / (1024 * 1024)).toFixed(1) + ' MB';
      div.innerHTML = '<div class="upload-file-top"><span class="upload-file-name">' + escapeHtml(name) + '</span><span class="upload-file-size">' + sizeStr + '</span><button type="button" class="upload-file-remove" data-id="' + id + '">&times;</button></div><div class="upload-file-progress"><div class="upload-file-progress-fill" style="width:0%"></div></div>';
      var self = this;
      div.querySelector('.upload-file-remove').addEventListener('click', function () {
        self.uploadedFiles = self.uploadedFiles.filter(function (f) { return f.id !== id; });
        div.remove();
        self.save();
      });
      list.appendChild(div);
    }

    async uploadFile(id, file) {
      var item = document.getElementById('ufi-' + id);
      var progressFill = item ? item.querySelector('.upload-file-progress-fill') : null;
      var entry = this.uploadedFiles.find(function (f) { return f.id === id; });
      try {
        var presignRes = await fetch('/.netlify/functions/upload-presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', size: file.size, clientName: this.form.querySelector('[name="company"]').value || this.form.querySelector('[name="name"]').value || '' })
        });
        if (!presignRes.ok) throw new Error('Presign failed');
        var presignData = await presignRes.json();

        var xhr = new XMLHttpRequest();
        xhr.open('PUT', presignData.uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.upload.addEventListener('progress', function (e) {
          if (e.lengthComputable && progressFill) {
            progressFill.style.width = Math.round((e.loaded / e.total) * 100) + '%';
          }
        });
        await new Promise(function (resolve, reject) {
          xhr.onload = function () { xhr.status < 300 ? resolve() : reject(new Error('Upload failed')); };
          xhr.onerror = reject;
          xhr.send(file);
        });

        if (entry) { entry.url = presignData.fileUrl; entry.status = 'uploaded'; }
        if (progressFill) progressFill.style.width = '100%';
        if (item) {
          var prog = item.querySelector('.upload-file-progress');
          if (prog) setTimeout(function () { prog.style.display = 'none'; }, 500);
        }
      } catch (err) {
        console.error('File upload error:', err);
        if (entry) entry.status = 'error';
        if (item) {
          var top = item.querySelector('.upload-file-top');
          if (top) {
            var errSpan = document.createElement('span');
            errSpan.className = 'upload-file-error';
            errSpan.textContent = 'Upload failed - file will not be attached';
            top.appendChild(errSpan);
          }
          var prog = item.querySelector('.upload-file-progress');
          if (prog) prog.style.display = 'none';
        }
      }
    }

    /* --- Smart Suggestions (Section 2) --- */
    updateServiceSuggestions() {
      var area = document.getElementById('service-suggestions');
      if (!area) return;
      area.innerHTML = '';
      var selected = this.getSelectedServices();
      if (selected.length === 0) return;
      var self = this;

      SMART_SUGGESTIONS.forEach(function (rule) {
        if (rule.only && (selected.length !== rule.if.length || !rule.if.every(function (s) { return selected.indexOf(s) !== -1; }))) return;
        if (!rule.only) {
          var allPresent = rule.if.every(function (s) { return selected.indexOf(s) !== -1; });
          if (!allPresent) return;
          if (rule.not && rule.not.length > 0) {
            var anyExcluded = rule.not.some(function (s) { return selected.indexOf(s) !== -1; });
            if (anyExcluded) return;
          }
        }

        var card = document.createElement('div');
        card.className = 'suggestion-card' + (rule.positive ? ' suggestion-card-positive' : '');
        var p = document.createElement('p');
        p.textContent = rule.msg;
        card.appendChild(p);

        if (rule.add) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'suggestion-add-btn';
          btn.textContent = '+ Add';
          btn.addEventListener('click', function () {
            var cb = self.form.querySelector('input[name="services"][value="' + rule.add + '"]');
            if (cb && !cb.checked) { cb.checked = true; card.remove(); self.updateServiceSuggestions(); self.save(); }
          });
          card.appendChild(btn);
        }
        area.appendChild(card);
      });
    }

    /* --- Smart Pre-selections (Website features) --- */
    applySmartPreselections() {
      var priority = this.form.querySelector('input[name="priority_metric"]:checked');
      if (!priority) return;

      var preset = PRESELECTIONS[priority.value];
      if (!preset || !preset.ws_features) return;

      var wsType = this.form.querySelector('[name="ws_type"]');
      var typePreset = wsType ? WS_TYPE_PRESELECTIONS[wsType.value] : null;

      var allSuggested = (preset.ws_features || []).concat(typePreset || []);
      var unique = allSuggested.filter(function (v, i, a) { return a.indexOf(v) === i; });

      if (unique.length === 0) return;

      var self = this;
      var anyApplied = false;
      unique.forEach(function (feature) {
        var cb = self.form.querySelector('input[name="ws_features"][value="' + feature + '"]');
        if (cb && !cb.checked && !self.preselectedFeatures.has(feature)) {
          cb.checked = true;
          self.preselectedFeatures.add(feature);
          anyApplied = true;
        }
      });

      var hint = document.getElementById('ws-features-hint');
      if (hint && anyApplied) hint.hidden = false;
    }

    /* --- Smart Warnings (Website) --- */
    checkWebsiteWarnings() {
      var warningEl = document.getElementById('ws-warning');
      if (!warningEl) return;
      var budget = this.form.querySelector('[name="ws_budget"]');
      var timeline = this.form.querySelector('[name="ws_timeline"]');
      var pages = this.form.querySelector('[name="ws_pages"]');
      var features = this.form.querySelectorAll('input[name="ws_features"]:checked');
      var msgs = [];

      if (budget && timeline && budget.value === 'Under €1,000' && timeline.value && timeline.value.indexOf('ASAP') !== -1) {
        msgs.push("Rush timelines with limited budgets can be challenging. I'll include realistic options in my proposal.");
      }
      if (pages && budget && pages.value === '30+ (large)' && (budget.value === 'Under €1,000' || budget.value === '€1,000–€3,000')) {
        msgs.push("Large websites with many pages typically require a higher investment. I'll suggest a phased approach.");
      }
      if (features.length > 10 && timeline && timeline.value && timeline.value.indexOf('ASAP') !== -1) {
        msgs.push("That's an ambitious feature set for a quick timeline. I'll prioritize the essentials in my proposal.");
      }

      warningEl.hidden = msgs.length === 0;
      warningEl.innerHTML = msgs.map(function (m) {
        return '<div class="smart-warning-item">' + m + '</div>';
      }).join('');

      var self = this;
      ['ws_budget', 'ws_timeline', 'ws_pages'].forEach(function (name) {
        var el = self.form.querySelector('[name="' + name + '"]');
        if (el && !el._wzWarningBound) {
          el._wzWarningBound = true;
          el.addEventListener('change', function () { self.checkWebsiteWarnings(); });
        }
      });
      self.form.querySelectorAll('input[name="ws_features"]').forEach(function (cb) {
        if (!cb._wzWarningBound) {
          cb._wzWarningBound = true;
          cb.addEventListener('change', function () { self.checkWebsiteWarnings(); });
        }
      });
    }

    /* --- Database Budget Visibility --- */
    updateDbBudgetVisibility() {
      var row = document.getElementById('db-budget-row');
      if (!row) return;
      var services = this.getSelectedServices();
      var hasWebOrApp = services.indexOf('website') !== -1 || services.indexOf('mobile_app') !== -1;
      row.hidden = hasWebOrApp;
    }

    /* --- Persistence --- */
    save() {
      try {
        var data = new FormData(this.form);
        var obj = {};
        data.forEach(function (value, key) {
          if (obj[key]) {
            if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
            obj[key].push(value);
          } else {
            obj[key] = value;
          }
        });
        obj._currentIndex = this.currentIndex;
        obj._uploadedFiles = this.uploadedFiles.map(function (f) {
          return { id: f.id, name: f.name, size: f.size, url: f.url, status: f.status };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } catch (e) { /* quota exceeded or private browsing */ }
    }

    restore() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        var obj = JSON.parse(raw);
        var self = this;

        Object.keys(obj).forEach(function (key) {
          if (key.startsWith('_')) return;
          var val = obj[key];
          var els = self.form.querySelectorAll('[name="' + key + '"]');
          if (els.length === 0) return;

          var first = els[0];
          if (first.type === 'checkbox') {
            var vals = Array.isArray(val) ? val : [val];
            els.forEach(function (el) { el.checked = vals.indexOf(el.value) !== -1; });
          } else if (first.type === 'radio') {
            els.forEach(function (el) { el.checked = el.value === val; });
          } else if (first.tagName === 'SELECT' || first.tagName === 'TEXTAREA' || first.tagName === 'INPUT') {
            first.value = val;
          }
        });

        this.form.querySelectorAll('[data-conditional]').forEach(function (select) {
          self.handleConditional(select);
        });

        var checkedPriority = this.form.querySelector('input[name="priority_metric"]:checked');
        if (checkedPriority) {
          var pcard = checkedPriority.closest('.pcard');
          var followup = pcard.querySelector('.pcard-followup');
          if (followup) followup.hidden = false;
        }

        this.form.querySelectorAll('[data-show-for-select]').forEach(function (el) {
          var selectName = el.getAttribute('data-show-for-select');
          var showVal = el.getAttribute('data-show-value');
          var select = self.form.querySelector('[name="' + selectName + '"]');
          if (select) el.hidden = select.value !== showVal;
        });

        var otherCb = this.form.querySelector('input[name="services"][value="other"]');
        var otherTa = this.form.querySelector('[data-show-when-service="other"]');
        if (otherCb && otherTa) otherTa.hidden = !otherCb.checked;

        this.form.querySelectorAll('select[data-custom-option]').forEach(function (sel) {
          if (sel.value === '__custom__') {
            var ci = sel.parentElement.querySelector('.wz-custom-input');
            if (ci) ci.hidden = false;
          }
        });

        // source_referral is now handled by data-show-for-select in initConditionalFields

        document.querySelectorAll('.wz-conditional-asset').forEach(function (el) {
          var asset = el.getAttribute('data-asset');
          var cb = self.form.querySelector('input[name="existing_assets"][value="' + asset + '"]');
          if (cb) el.hidden = !cb.checked;
        });

        this.restoreRepeater('rep-competitors', 'tpl-competitor', obj, ['competitors_url[]', 'competitors_good[]', 'competitors_bad[]']);
        this.restoreRepeater('rep-references', 'tpl-reference', obj, ['references_url[]', 'references_like[]']);

        if (obj._uploadedFiles) {
          this.uploadedFiles = obj._uploadedFiles;
          this.uploadedFiles.forEach(function (f) { self.renderFileItem(f.id, f.name, f.size); });
        }

        if (typeof obj._currentIndex === 'number') {
          var maxValid = this.steps.length - 1;
          this.currentIndex = Math.min(obj._currentIndex, maxValid);
        }
      } catch (e) { /* corrupt data */ }
    }

    restoreRepeater(repeaterId, templateId, obj, fieldNames) {
      var values = fieldNames.map(function (name) {
        var val = obj[name];
        if (!val) return [];
        return Array.isArray(val) ? val : [val];
      });
      var count = Math.max.apply(null, values.map(function (v) { return v.length; }));
      if (count <= 0) return;

      var rep = document.getElementById(repeaterId);
      if (!rep) return;
      var rowsContainer = rep.querySelector('.repeater-rows');
      var addBtn = rep.querySelector('.repeater-add-btn');
      var tpl = document.getElementById(templateId);
      var self = this;

      // Clear existing empty rows
      rowsContainer.innerHTML = '';

      for (var i = 0; i < count; i++) {
        var clone = tpl.content.cloneNode(true);
        var row = clone.querySelector('.repeater-row');
        var inputs = row.querySelectorAll('.wz-input');
        for (var j = 0; j < fieldNames.length && j < inputs.length; j++) {
          if (values[j][i]) inputs[j].value = values[j][i];
        }
        row.querySelector('.repeater-remove-btn').addEventListener('click', function () {
          this.closest('.repeater-row').remove();
          var max = parseInt(rep.getAttribute('data-max') || '5', 10);
          if (rowsContainer.children.length < max) addBtn.hidden = false;
          self.save();
        });
        rowsContainer.appendChild(row);
      }
    }

    /* --- Summary Builder --- */
    buildSummary() {
      var content = document.getElementById('summary-content');
      content.innerHTML = '';
      var self = this;

      function addSection(title, stepId, rows) {
        var filtered = rows.filter(function (r) { return r[1]; });
        if (filtered.length === 0) return;
        var sec = document.createElement('div');
        sec.className = 'summary-section';
        var head = document.createElement('div');
        head.className = 'summary-section-head';
        head.innerHTML = '<span class="summary-section-title">' + escapeHtml(title) + '</span>';
        var editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'summary-edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function () { self.goToStep(stepId); });
        head.appendChild(editBtn);
        sec.appendChild(head);

        var body = document.createElement('div');
        body.className = 'summary-section-body';
        filtered.forEach(function (row) {
          var r = document.createElement('div');
          r.className = 'summary-row';
          r.innerHTML = '<span class="summary-row-label">' + escapeHtml(row[0]) + '</span><span class="summary-row-value">' + escapeHtml(row[1]) + '</span>';
          body.appendChild(r);
        });
        sec.appendChild(body);
        content.appendChild(sec);
      }

      function v(name) {
        var el = self.form.querySelector('[name="' + name + '"]');
        if (!el) return '';
        if (el.type === 'radio') {
          var checked = self.form.querySelector('[name="' + name + '"]:checked');
          return checked ? checked.value : '';
        }
        if (el.type === 'checkbox') {
          var allChecked = self.form.querySelectorAll('[name="' + name + '"]:checked');
          var vals = [];
          allChecked.forEach(function (c) { if (!isFieldHidden(c)) vals.push(c.value); });
          return vals.join(', ');
        }
        if (isFieldHidden(el)) return '';
        return el.value || '';
      }

      addSection('About You', 'about-you', [
        ['Name', v('name')], ['Email', v('email')], ['Phone', v('phone')],
        ['Company', v('company')], ['Role', v('role') === '__custom__' ? v('role_custom') : v('role')],
        ['Location', v('location')], ['Source', v('source') === '__custom__' ? v('source_custom') : v('source')]
      ]);

      addSection('Services', 'services', [['Selected', v('services')]]);

      var priority = v('priority_metric');
      addSection('About Your Project', 'about-project', [
        ['Business', v('business_description')], ['Project type', v('project_type')],
        ['Goal', v('project_goal')], ['Priority', priority],
        ['Target audience', v('target_audience')], ['Deadline', v('deadline')]
      ]);

      addSection('Current Situation', 'current-situation', [
        ['Already have', v('existing_assets')], ['Working well', v('whats_working')],
        ['Not working', v('whats_not_working')], ['Previous experience', v('previous_experience')]
      ]);

      var services = this.getSelectedServices();
      if (services.indexOf('website') !== -1) {
        addSection('Website', 'website-details', [
          ['Type', v('ws_type')], ['Pages', v('ws_pages')], ['Features', v('ws_features')],
          ['Content ready', v('ws_content')], ['Domain', v('ws_domain')], ['Hosting', v('ws_hosting')],
          ['Integrations', v('ws_integrations')], ['Maintenance', v('ws_maintenance')],
          ['Budget', v('ws_budget')], ['Timeline', v('ws_timeline')]
        ]);
      }
      if (services.indexOf('mobile_app') !== -1) {
        addSection('Mobile App', 'mobile-app-details', [
          ['Type', v('ma_type')], ['Platforms', v('ma_platforms')], ['Pricing', v('ma_pricing')],
          ['Features', v('ma_features')], ['Designs', v('ma_designs')], ['Expected users', v('ma_expected_users')],
          ['Budget', v('ma_budget')], ['Timeline', v('ma_timeline')]
        ]);
      }
      if (services.indexOf('branding') !== -1) {
        addSection('Branding', 'branding-details', [
          ['Needs', v('br_needs')], ['Existing', v('br_existing')], ['Personality', v('br_personality')],
          ['Budget', v('br_budget')], ['Timeline', v('br_timeline')]
        ]);
      }
      if (services.indexOf('marketing') !== -1) {
        addSection('Marketing', 'marketing-details', [
          ['Services', v('mk_services')], ['Current', v('mk_current')], ['Ad budget', v('mk_ad_budget')],
          ['Mgmt budget', v('mk_mgmt_budget')], ['Target leads', v('mk_target_leads')],
          ['Geo target', v('mk_geo_target')], ['Start', v('mk_start')]
        ]);
      }
      if (services.indexOf('video') !== -1) {
        addSection('Video', 'video-details', [
          ['Types', v('vd_types')], ['Count', v('vd_count')], ['Length', v('vd_length')],
          ['Footage', v('vd_footage')], ['Usage', v('vd_usage')],
          ['Budget', v('vd_budget')], ['Timeline', v('vd_timeline')]
        ]);
      }
      if (services.indexOf('database') !== -1) {
        addSection('Database & Backend', 'database-details', [
          ['Needs', v('db_needs')], ['Existing', v('db_existing')], ['Users', v('db_users')],
          ['Data types', v('db_data')], ['Budget', v('db_budget')], ['Timeline', v('db_timeline')]
        ]);
      }
      if (services.indexOf('design') !== -1) {
        addSection('UI/UX Design', 'design-details', [
          ['Needs', v('dg_needs')], ['Style', v('dg_style')],
          ['Budget', v('dg_budget')], ['Timeline', v('dg_timeline')]
        ]);
      }
      if (services.indexOf('consulting') !== -1) {
        addSection('Consulting', 'consulting-details', [
          ['Needs', v('co_needs')], ['Format', v('co_format')], ['Budget', v('co_budget')]
        ]);
      }

      addSection('Working Together', 'working-together', [
        ['Decision maker', v('wt_decisions')], ['Involvement', v('wt_involvement')],
        ['Communication', v('wt_communication')], ['Language', v('wt_language')],
        ['Availability', v('wt_availability')], ['NDA', v('wt_nda')],
        ['Files', this.uploadedFiles.filter(function (f) { return f.status === 'uploaded'; }).map(function (f) { return f.name; }).join(', ')],
        ['Additional notes', v('wt_additional_notes')]
      ]);
    }

    /* --- Form Submission --- */
    async submit() {
      if (!this.validateCurrentStep()) return;

      var honeypot = this.form.querySelector('[name="website_url"]');
      if (honeypot && honeypot.value) {
        this.showSuccess();
        return;
      }

      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Sending...';

      try {
        var data = {};
        var allFields = this.form.querySelectorAll('input, select, textarea');
        allFields.forEach(function (el) {
          var key = el.name;
          if (!key || key === 'website_url') return;
          if (isFieldHidden(el)) return;
          var value;
          if (el.type === 'checkbox') {
            if (!el.checked) return;
            value = el.value;
          } else if (el.type === 'radio') {
            if (!el.checked) return;
            value = el.value;
          } else {
            value = el.value;
          }
          if (data[key]) {
            if (!Array.isArray(data[key])) data[key] = [data[key]];
            data[key].push(value);
          } else {
            data[key] = value;
          }
        });

        data.files = this.uploadedFiles
          .filter(function (f) { return f.status === 'uploaded' && f.url; })
          .map(function (f) { return { name: f.name, size: f.size, url: f.url }; });

        var response = await fetch('/.netlify/functions/project-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          var result = await response.json();
          throw new Error(result.error || 'Failed to send');
        }

        localStorage.removeItem(STORAGE_KEY);
        this.showSuccess();
      } catch (error) {
        console.error('Submit error:', error);
        this.showSubmitError(error.message);
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = 'Send Request <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      }
    }

    showSubmitError(message) {
      var existing = document.getElementById('wizard-submit-error');
      if (existing) existing.remove();
      var errEl = document.createElement('div');
      errEl.id = 'wizard-submit-error';
      errEl.className = 'wizard-submit-error';
      errEl.setAttribute('role', 'alert');
      errEl.setAttribute('aria-live', 'assertive');
      errEl.textContent = 'Something went wrong: ' + message + '. Please try again.';
      var nav = document.getElementById('wizard-nav');
      if (nav && nav.parentElement) {
        nav.parentElement.insertBefore(errEl, nav);
      }
      errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showSuccess() {
      var nameEl = document.getElementById('success-name');
      var name = this.form.querySelector('[name="name"]');
      if (nameEl && name && name.value) {
        nameEl.textContent = name.value.split(' ')[0];
      }
      this.allStepEls.forEach(function (el) { el.hidden = true; });
      var successEl = document.querySelector('[data-step="success"]');
      if (successEl) successEl.hidden = false;
      document.getElementById('wizard-nav').hidden = true;
      document.getElementById('wizard-progress').hidden = true;
      document.querySelector('.wizard-footer-actions').hidden = true;
      this.priorityBadge.hidden = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* --- Helpers --- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function isFieldHidden(el) {
    var node = el.parentElement;
    while (node && node !== document.body) {
      if (node.classList && node.classList.contains('wizard-step')) return false;
      if (node.hidden) return true;
      node = node.parentElement;
    }
    return false;
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', function () {
    new FormWizard();
  });
})();

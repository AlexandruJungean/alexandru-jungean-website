import nodemailer from 'nodemailer';

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().substring(0, 10000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeObj(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(function (v) { return typeof v === 'string' ? sanitize(v) : sanitizeObj(v); });
  var result = {};
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    if (typeof val === 'string') result[key] = sanitize(val);
    else if (Array.isArray(val)) result[key] = val.map(function (v) { return typeof v === 'string' ? sanitize(v) : sanitizeObj(v); });
    else if (typeof val === 'object' && val !== null) result[key] = sanitizeObj(val);
    else result[key] = val;
  });
  return result;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function arr(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function row(label, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '';
  var display = Array.isArray(value) ? value.join(', ') : value;
  return '<tr><td class="detail-label" style="padding:6px 12px 6px 0;color:#666;vertical-align:top;width:34%">' + label + '</td><td style="padding:6px 0;color:#181818;word-break:break-word">' + display + '</td></tr>';
}

function sectionHtml(title, rows) {
  var filtered = rows.filter(Boolean);
  if (filtered.length === 0) return '';
  return '<div style="margin-bottom:22px"><h3 style="font-size:14px;color:#678b9e;margin:0 0 8px">' + title + '</h3><table style="width:100%;border-collapse:collapse;font-size:13px">' + filtered.join('') + '</table></div>';
}

function brandedEmailShell(content, preheader, maxWidth) {
  return '<!doctype html>' +
    '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>@media only screen and (max-width:600px){.email-pad{padding-left:20px!important;padding-right:20px!important}.email-title{font-size:24px!important}.email-logo{width:180px!important}.detail-label{width:32%!important}}</style></head>' +
    '<body style="margin:0;padding:0;color:#181818;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">' + escapeHtml(preheader) + '</div>' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%">' +
    '<tr><td align="center" style="padding:0">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:' + maxWidth + '">' +
    '<tr><td class="email-pad" style="background-color:#181818;padding:20px 24px">' +
    '<a href="https://alexjungean.com" style="display:inline-block;text-decoration:none">' +
    '<img class="email-logo" src="https://alexjungean.com/images/email-logo.png" width="180" height="35" alt="Alexandru Jungean" style="display:block;width:180px;max-width:100%;height:auto;border:0">' +
    '</a></td></tr>' +
    '<tr><td>' + content + '</td></tr>' +
    '<tr><td class="email-pad" style="background-color:#181818;padding:20px 24px;color:#bfbfbf;font-size:12px;line-height:1.6">' +
    '<p style="margin:0 0 10px"><a href="https://alexjungean.com/projects" style="color:#fff;text-decoration:none">Projects</a>' +
    '<span style="color:#678b9e;padding:0 8px">•</span><a href="https://www.linkedin.com/in/alexandru-jungean/" style="color:#fff;text-decoration:none">LinkedIn</a>' +
    '<span style="color:#678b9e;padding:0 8px">•</span><a href="https://github.com/AlexandruJungean" style="color:#fff;text-decoration:none">GitHub</a></p>' +
    '<p style="margin:0">Alexandru Jungean · IT Freelancer</p></td></tr>' +
    '</table></td></tr></table></body></html>';
}

var SERVICE_LABELS = {
  website: 'Website', mobile_app: 'Mobile App', branding: 'Branding & Identity',
  marketing: 'Marketing & Ads', video: 'Video Production', database: 'Database & Backend',
  design: 'UI/UX Design', consulting: 'Strategy & Consulting', other: 'Other'
};

function formatServices(raw) {
  return arr(raw).map(function (s) { return SERVICE_LABELS[s] || s; });
}

function buildAdminEmail(d) {
  var serviceIds = arr(d.services);
  var services = formatServices(d.services);
  var files = arr(d.files);

  var html = '<div class="email-pad" style="padding:28px 24px">';
  html += '<h1 style="font-size:20px;color:#181818;margin:0 0 4px">New Project Inquiry</h1>';
  html += '<p style="font-size:12px;color:#838383;margin:0 0 20px">Submitted ' + new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) + '</p>';

  html += '<div style="margin-bottom:22px">';
  html += '<p style="margin:0;font-size:13px;color:#474644"><strong style="color:#181818">Priority:</strong> ' + (d.priority_metric || 'Not set') + '</p>';
  html += '<p style="margin:6px 0 0;font-size:13px;color:#474644"><strong style="color:#181818">Services:</strong> ' + services.join(', ') + '</p>';
  html += '</div>';

  html += sectionHtml('Contact', [
    row('Name', d.name), row('Email', d.email), row('Phone', d.phone),
    row('Company', d.company),
    row('Role', d.role === '__custom__' ? d.role_custom : d.role),
    row('Location', d.location),
    row('Source', d.source === '__custom__' ? d.source_custom : d.source),
    row('Referral', d.source_referral),
    row('Conference', d.source_conference)
  ]);

  html += sectionHtml('About the Project', [
    row('Business', d.business_description), row('Project type', d.project_type),
    row('Current URL', d.current_url || d.current_url_features),
    row("What's not working", d.whats_not_working_existing),
    row('Features to add', d.features_to_add),
    row('Goal', d.project_goal), row('Priority', d.priority_metric),
    row('Leads target', d.priority_leads_target), row('Revenue target', d.priority_leads_revenue ? (d.priority_leads_currency || 'EUR') + ' ' + d.priority_leads_revenue : ''),
    row('Desired action', d.priority_conv_action), row('Conv. rate', d.priority_conv_rate),
    row('System users', d.priority_eff_users), row('Hours saved/wk', d.priority_eff_hours),
    row('Users 6mo', d.priority_growth_6m), row('Users 12mo', d.priority_growth_12m),
    row('Products', d.priority_ecom_products), row('Monthly revenue', d.priority_ecom_revenue ? (d.priority_ecom_currency || 'EUR') + ' ' + d.priority_ecom_revenue : ''),
    row('Priority (other)', d.priority_other_desc),
    row('Audience', d.target_audience),
    row('Deadline', d.deadline), row('Deadline date', d.deadline_date), row('Deadline reason', d.deadline_reason)
  ]);

  html += sectionHtml('Current Situation', [
    row('Already have', arr(d.existing_assets)),
    row('Website URL', d.asset_website_url), row('Monthly visitors', d.asset_website_visitors),
    row('App', d.asset_app_name), row('App users', d.asset_app_users),
    row('Social', d.asset_social_details),
    row('Ad spend', d.asset_ads_spend), row('Ad platforms', d.asset_ads_platforms),
    row('Email subs', d.asset_email_subscribers), row('CRM', d.asset_crm_system),
    row("What's working", d.whats_working), row("What's not working", d.whats_not_working),
    row('Previous exp.', d.previous_experience), row('Exp. detail', d.prev_exp_good || d.prev_exp_bad)
  ]);

  var competitors = [];
  var cUrls = arr(d['competitors_url[]']);
  var cGood = arr(d['competitors_good[]']);
  var cBad = arr(d['competitors_bad[]']);
  for (var i = 0; i < cUrls.length; i++) {
    if (cUrls[i]) competitors.push(cUrls[i] + (cGood[i] ? ' (good: ' + cGood[i] + ')' : '') + (cBad[i] ? ' (improve: ' + cBad[i] + ')' : ''));
  }
  if (competitors.length) html += sectionHtml('Competitors', [row('List', competitors.join('<br>'))]);

  var refs = [];
  var rUrls = arr(d['references_url[]']);
  var rLike = arr(d['references_like[]']);
  for (var j = 0; j < rUrls.length; j++) {
    if (rUrls[j]) refs.push(rUrls[j] + (rLike[j] ? ' - ' + rLike[j] : ''));
  }
  if (refs.length) html += sectionHtml('References', [row('List', refs.join('<br>'))]);

  if (serviceIds.indexOf('website') !== -1) {
    html += sectionHtml('Website Details', [
      row('Type', d.ws_type === '__custom__' ? d.ws_type_custom : d.ws_type),
      row('Pages', d.ws_pages), row('Features', arr(d.ws_features)),
      row('Content', arr(d.ws_content)), row('Domain', d.ws_domain + (d.ws_domain_name ? ' (' + d.ws_domain_name + ')' : '')),
      row('Hosting', d.ws_hosting + (d.ws_hosting_provider ? ' (' + d.ws_hosting_provider + ')' : '')),
      row('Integrations', d.ws_integrations), row('Maintenance', d.ws_maintenance),
      row('Budget', d.ws_budget), row('Timeline', d.ws_timeline)
    ]);
  }

  if (serviceIds.indexOf('mobile_app') !== -1) {
    html += sectionHtml('Mobile App Details', [
      row('Type', d.ma_type === '__custom__' ? d.ma_type_custom : d.ma_type),
      row('Platforms', arr(d.ma_platforms)), row('Pricing', d.ma_pricing),
      row('Features', arr(d.ma_features)), row('Designs', d.ma_designs),
      row('Expected users', d.ma_expected_users), row('Backend', d.ma_backend),
      row('Backend desc', d.ma_backend_desc), row('Store accounts', d.ma_stores),
      row('Post-launch', d.ma_support),
      row('Budget', d.ma_budget), row('Timeline', d.ma_timeline)
    ]);
  }

  if (serviceIds.indexOf('branding') !== -1) {
    html += sectionHtml('Branding Details', [
      row('Needs', arr(d.br_needs)), row('Existing', d.br_existing),
      row('Personality', arr(d.br_personality)), row('Colors', d.br_colors),
      row('Admired brands', d.br_admired_brands),
      row('Budget', d.br_budget), row('Timeline', d.br_timeline)
    ]);
  }

  if (serviceIds.indexOf('marketing') !== -1) {
    html += sectionHtml('Marketing Details', [
      row('Services', arr(d.mk_services)), row('Current', arr(d.mk_current)),
      row('Ad budget', d.mk_ad_budget), row('Mgmt budget', d.mk_mgmt_budget),
      row('Target leads', d.mk_target_leads), row('Geo', d.mk_geo_target),
      row('Demographics', d.mk_demographics), row('Start', d.mk_start)
    ]);
  }

  if (serviceIds.indexOf('video') !== -1) {
    html += sectionHtml('Video Details', [
      row('Types', arr(d.vd_types)), row('Count', d.vd_count), row('Length', d.vd_length),
      row('Footage', d.vd_footage), row('Usage', arr(d.vd_usage)),
      row('Budget', d.vd_budget), row('Timeline', d.vd_timeline)
    ]);
  }

  if (serviceIds.indexOf('database') !== -1) {
    html += sectionHtml('Database & Backend Details', [
      row('Needs', arr(d.db_needs)), row('Existing', d.db_existing),
      row('Existing desc', d.db_existing_desc), row('Users', d.db_users),
      row('Data types', arr(d.db_data)), row('Integrations', d.db_integrations),
      row('Budget', d.db_budget), row('Timeline', d.db_timeline)
    ]);
  }

  if (serviceIds.indexOf('design') !== -1) {
    html += sectionHtml('UI/UX Design Details', [
      row('Needs', arr(d.dg_needs)),
      row('Style', d.dg_style === '__custom__' ? d.dg_style_custom : d.dg_style),
      row('Budget', d.dg_budget), row('Timeline', d.dg_timeline)
    ]);
  }

  if (serviceIds.indexOf('consulting') !== -1) {
    html += sectionHtml('Consulting Details', [
      row('Needs', arr(d.co_needs)), row('Format', d.co_format), row('Budget', d.co_budget)
    ]);
  }

  html += sectionHtml('Working Together', [
    row('Decisions', d.wt_decisions), row('Involvement', d.wt_involvement),
    row('Communication', d.wt_communication), row('Comm. details', d.wt_communication_mix),
    row('Language', d.wt_language),
    row('Availability', arr(d.wt_availability)), row('NDA', d.wt_nda),
    row('Notes', d.wt_additional_notes)
  ]);

  if (files.length > 0) {
    var fileRows = files.map(function (f) {
      var sizeStr = f.size < 1048576 ? Math.round(f.size / 1024) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB';
      return '<a href="' + f.url + '" style="color:#8aacbb">' + f.name + '</a> (' + sizeStr + ')';
    }).join('<br>');
    html += sectionHtml('Attachments', [row('Files', fileRows)]);
  }

  html += '</div>';
  return brandedEmailShell(html, 'A new project inquiry has been submitted.', '700px');
}

function buildClientEmail(d) {
  var name = (d.name || '').split(' ')[0] || 'there';
  var services = formatServices(d.services);

  var html = '<div class="email-pad" style="padding:30px 24px 28px">';
  html += '<p style="margin:0 0 10px;color:#678b9e;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase">Project inquiry received</p>';
  html += '<h1 class="email-title" style="margin:0 0 14px;color:#181818;font-size:27px;line-height:1.25">Thank you, ' + escapeHtml(name) + '!</h1>';
  html += '<p style="margin:0;color:#474644;font-size:16px;line-height:1.65">I\'ve received your project details and will get back to you with initial thoughts within <strong style="color:#181818">24 hours</strong>.</p>';

  html += '<div style="margin-top:24px">';
  html += '<p style="margin:0 0 12px;color:#678b9e;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">Your submission summary</p>';
  if (d.priority_metric) html += '<p style="margin:6px 0;color:#474644;font-size:14px"><strong style="color:#181818">Priority:</strong> ' + escapeHtml(d.priority_metric) + '</p>';
  html += '<p style="margin:6px 0;color:#474644;font-size:14px"><strong style="color:#181818">Services:</strong> ' + escapeHtml(services.join(', ')) + '</p>';
  if (d.project_goal) html += '<p style="margin:6px 0;color:#474644;font-size:14px;line-height:1.55"><strong style="color:#181818">Goal:</strong> ' + escapeHtml(d.project_goal) + '</p>';
  html += '</div>';

  html += '<p style="margin:24px 0 0;color:#474644;font-size:15px;line-height:1.65">In the meantime, you can explore some of my recent work.</p>';
  html += '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px"><tr><td style="background:#678b9e;border-radius:7px">';
  html += '<a href="https://alexjungean.com/projects" style="display:inline-block;padding:12px 20px;color:#fff;font-size:14px;font-weight:bold;text-decoration:none">View my projects</a>';
  html += '</td></tr></table>';
  html += '<p style="margin:28px 0 0;color:#474644;font-size:14px;line-height:1.6">Best regards,<br><strong style="color:#181818">Alexandru Jungean</strong><br>IT Freelancer</p>';
  html += '<p style="margin:22px 0 0;color:#838383;font-size:11px;line-height:1.5">This is an automated confirmation. If you need to reach me, reply to this email or use the <a href="https://alexjungean.com/contact" style="color:#678b9e">contact form</a>.</p>';
  html += '</div>';

  return brandedEmailShell(html, 'Your project inquiry has been received. I will reply within 24 hours.', '640px');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    var data = JSON.parse(event.body);

    if (data.website_url) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    data = sanitizeObj(data);

    if (!data.name || !data.email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and email are required' }) };
    }
    if (!isValidEmail(data.email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
    }

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
    });

    var services = formatServices(data.services);
    var subjectLine = 'New Project: ' + (data.company || data.name) + ' - ' + services.slice(0, 3).join(', ');

    await transporter.sendMail({
      from: '"Project Inquiry" <' + process.env.GMAIL_USER + '>',
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: subjectLine,
      html: buildAdminEmail(data)
    });

    await transporter.sendMail({
      from: '"Alexandru Jungean" <' + process.env.GMAIL_USER + '>',
      to: data.email,
      subject: "Got it, " + (data.name || '').split(' ')[0] + "! Here's a summary of your project inquiry",
      html: buildClientEmail(data)
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Project inquiry error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send. Please try again later.' }) };
  }
}

import nodemailer from 'nodemailer';

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().substring(0, 10000);
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
  return '<tr><td style="padding:6px 12px 6px 0;color:#888;vertical-align:top;white-space:nowrap;width:40%">' + label + '</td><td style="padding:6px 0;color:#ddd">' + display + '</td></tr>';
}

function sectionHtml(title, rows) {
  var filtered = rows.filter(Boolean);
  if (filtered.length === 0) return '';
  return '<div style="margin-bottom:20px"><h3 style="font-size:14px;color:#8aacbb;margin:0 0 8px;border-bottom:1px solid #333;padding-bottom:6px">' + title + '</h3><table style="width:100%;border-collapse:collapse;font-size:13px">' + filtered.join('') + '</table></div>';
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
  var services = formatServices(d.services);
  var files = arr(d.files);

  var html = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:700px;margin:0 auto;background:#1a1a1a;color:#e0e0e0;padding:24px;border-radius:12px">';
  html += '<h1 style="font-size:18px;color:#fff;margin:0 0 4px">New Project Inquiry</h1>';
  html += '<p style="font-size:12px;color:#888;margin:0 0 20px">Submitted ' + new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) + '</p>';

  html += '<div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:8px;padding:12px 16px;margin-bottom:20px">';
  html += '<p style="margin:0;font-size:13px;color:#c4b5fd"><strong>Priority:</strong> ' + (d.priority_metric || 'Not set') + '</p>';
  html += '<p style="margin:4px 0 0;font-size:13px;color:#c4b5fd"><strong>Services:</strong> ' + services.join(', ') + '</p>';
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

  if (services.indexOf('website') !== -1) {
    html += sectionHtml('Website Details', [
      row('Type', d.ws_type === '__custom__' ? d.ws_type_custom : d.ws_type),
      row('Pages', d.ws_pages), row('Features', arr(d.ws_features)),
      row('Content', arr(d.ws_content)), row('Domain', d.ws_domain + (d.ws_domain_name ? ' (' + d.ws_domain_name + ')' : '')),
      row('Hosting', d.ws_hosting + (d.ws_hosting_provider ? ' (' + d.ws_hosting_provider + ')' : '')),
      row('Integrations', d.ws_integrations), row('Maintenance', d.ws_maintenance),
      row('Budget', d.ws_budget), row('Timeline', d.ws_timeline)
    ]);
  }

  if (services.indexOf('mobile_app') !== -1) {
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

  if (services.indexOf('branding') !== -1) {
    html += sectionHtml('Branding Details', [
      row('Needs', arr(d.br_needs)), row('Existing', d.br_existing),
      row('Personality', arr(d.br_personality)), row('Colors', d.br_colors),
      row('Admired brands', d.br_admired_brands),
      row('Budget', d.br_budget), row('Timeline', d.br_timeline)
    ]);
  }

  if (services.indexOf('marketing') !== -1) {
    html += sectionHtml('Marketing Details', [
      row('Services', arr(d.mk_services)), row('Current', arr(d.mk_current)),
      row('Ad budget', d.mk_ad_budget), row('Mgmt budget', d.mk_mgmt_budget),
      row('Target leads', d.mk_target_leads), row('Geo', d.mk_geo_target),
      row('Demographics', d.mk_demographics), row('Start', d.mk_start)
    ]);
  }

  if (services.indexOf('video') !== -1) {
    html += sectionHtml('Video Details', [
      row('Types', arr(d.vd_types)), row('Count', d.vd_count), row('Length', d.vd_length),
      row('Footage', d.vd_footage), row('Usage', arr(d.vd_usage)),
      row('Budget', d.vd_budget), row('Timeline', d.vd_timeline)
    ]);
  }

  if (services.indexOf('database') !== -1) {
    html += sectionHtml('Database & Backend Details', [
      row('Needs', arr(d.db_needs)), row('Existing', d.db_existing),
      row('Existing desc', d.db_existing_desc), row('Users', d.db_users),
      row('Data types', arr(d.db_data)), row('Integrations', d.db_integrations),
      row('Budget', d.db_budget), row('Timeline', d.db_timeline)
    ]);
  }

  if (services.indexOf('design') !== -1) {
    html += sectionHtml('UI/UX Design Details', [
      row('Needs', arr(d.dg_needs)),
      row('Style', d.dg_style === '__custom__' ? d.dg_style_custom : d.dg_style),
      row('Budget', d.dg_budget), row('Timeline', d.dg_timeline)
    ]);
  }

  if (services.indexOf('consulting') !== -1) {
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
  return html;
}

function buildClientEmail(d) {
  var name = (d.name || '').split(' ')[0] || 'there';
  var services = formatServices(d.services);

  var html = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto">';
  html += '<h2 style="color:#678b9e">Thank you, ' + name + '!</h2>';
  html += '<p>I\'ve received your project details and will get back to you with initial thoughts within <strong>24 hours</strong>.</p>';

  html += '<div style="background:#f5f5f5;padding:16px 20px;border-radius:8px;margin:20px 0">';
  html += '<h3 style="margin:0 0 8px;font-size:14px;color:#333">Your submission summary:</h3>';
  if (d.priority_metric) html += '<p style="margin:4px 0;font-size:13px"><strong>Priority:</strong> ' + d.priority_metric + '</p>';
  html += '<p style="margin:4px 0;font-size:13px"><strong>Services:</strong> ' + services.join(', ') + '</p>';
  if (d.project_goal) html += '<p style="margin:4px 0;font-size:13px"><strong>Goal:</strong> ' + d.project_goal + '</p>';
  html += '</div>';

  html += '<p>In the meantime, feel free to:</p><ul>';
  html += '<li>Check out my <a href="https://alexjungean.com/projects" style="color:#678b9e">projects</a></li>';
  html += '<li>Connect on <a href="https://www.linkedin.com/in/alexandru-jungean-5604b7268/" style="color:#678b9e">LinkedIn</a></li>';
  html += '</ul>';

  html += '<p>Best regards,<br><strong>Alexandru Jungean</strong><br>IT Freelancer</p>';

  html += '<div style="margin:24px 0;padding:16px 0;border-top:1px solid #eee;border-bottom:1px solid #eee">';
  html += '<p style="margin:0 0 8px;font-size:13px;color:#666">Follow me on social media:</p>';
  html += '<p style="margin:0;font-size:13px">';
  html += '<a href="https://www.linkedin.com/in/alexandru-jungean-5604b7268/" style="color:#678b9e;text-decoration:none;margin-right:16px">LinkedIn</a>';
  html += '<a href="https://www.instagram.com/alexjungean/" style="color:#678b9e;text-decoration:none;margin-right:16px">Instagram</a>';
  html += '<a href="https://www.facebook.com/alex.jungean" style="color:#678b9e;text-decoration:none;margin-right:16px">Facebook</a>';
  html += '<a href="https://github.com/AlexandruJungean" style="color:#678b9e;text-decoration:none">GitHub</a>';
  html += '</p></div>';

  html += '<p style="color:#999;font-size:12px">This is an automated confirmation. If you need to reach me, reply to this email or visit <a href="https://alexjungean.com/contact" style="color:#999">alexjungean.com/contact</a>.</p>';
  html += '</div>';
  return html;
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

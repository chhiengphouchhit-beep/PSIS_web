const SHEET_NAME = 'ImageLibrary';
const LEADS_SHEET_NAME = 'AdmissionLeads';
const DRIVE_FOLDER_ID = '1N4cMZU18W3tVzCNEuMbX13aQ6EjdEE2Y';
const HEADERS = ['ID', 'Title', 'Category', 'Campus', 'ImageURL', 'DirectImageURL', 'Priority', 'Status', 'CreatedAt'];
const LEAD_HEADERS = ['ID', 'Name', 'Phone', 'Question', 'Language', 'Source', 'Status', 'CreatedAt'];
const CATEGORY_OPTIONS = ['Hero Banner', 'Campus Gallery', 'Partner Logo', 'AYLA Logo', 'News', 'Student Life', 'Header Logo', 'Campus Image', 'Academic Program', 'STEM Resource', 'Admissions Image'];
const CAMPUS_OPTIONS = ['Global', 'TK Campus', 'TTP Campus', 'Chbar Ampov Campus', 'Russey Keo Campus', 'Sen Sok Campus', 'Siem Reap Campus'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

function doGet() {
  const sheet = getImageLibrarySheet();
  ensureHeaders(sheet);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const records = values.map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return {
      id: Number(item.ID),
      title: item.Title,
      category: item.Category,
      campus: item.Campus,
      imageUrl: item.ImageURL,
      directImageUrl: item.DirectImageURL,
      priority: Number(item.Priority || 1),
      status: item.Status || 'Active',
      createdAt: item.CreatedAt,
    };
  });

  return json(records);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');

  if (body.action === 'uploadImage') {
    return json(uploadImage(body));
  }

  if (body.action === 'saveImage' || body.action === 'updateImage') {
    return json(upsertImageRecord(body));
  }

  if (body.action === 'saveLead') {
    return json(saveAdmissionLead(body));
  }

  return json({ ok: false, message: 'Unknown action' });
}

function uploadImage(body) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const bytes = Utilities.base64Decode(body.base64);
  const blob = Utilities.newBlob(bytes, body.mimeType, body.fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const imageUrl = `https://drive.google.com/file/d/${fileId}/view`;
  const directImageUrl = `https://drive.google.com/uc?id=${fileId}`;

  return upsertImageRecord({
    ID: body.ID || nextId(),
    Title: body.title || body.Title || body.fileName,
    Category: body.category || body.Category,
    Campus: body.campus || body.Campus,
    ImageURL: imageUrl,
    DirectImageURL: directImageUrl,
    Priority: body.priority || body.Priority || 1,
    Status: body.status || body.Status || 'Active',
    CreatedAt: body.createdAt || body.CreatedAt || new Date().toISOString(),
  });
}

function upsertImageRecord(body) {
  const sheet = getImageLibrarySheet();
  ensureHeaders(sheet);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const id = Number(body.ID || body.id || nextId());
  const rowIndex = rows.findIndex((row, index) => index > 0 && Number(row[0]) === id);
  const row = headers.map((header) => {
    if (header === 'ID') return id;
    if (header === 'Title') return body.Title || body.title || '';
    if (header === 'Category') return body.Category || body.category || '';
    if (header === 'Campus') return body.Campus || body.campus || '';
    if (header === 'ImageURL') return body.ImageURL || body.imageUrl || '';
    if (header === 'DirectImageURL') return body.DirectImageURL || body.directImageUrl || '';
    if (header === 'Priority') return body.Priority || body.priority || 1;
    if (header === 'Status') return body.Status || body.status || 'Active';
    if (header === 'CreatedAt') return body.CreatedAt || body.createdAt || new Date().toISOString();
    return '';
  });

  if (rowIndex > 0) {
    sheet.getRange(rowIndex + 1, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return {
    id,
    title: row[headers.indexOf('Title')],
    category: row[headers.indexOf('Category')],
    campus: row[headers.indexOf('Campus')],
    imageUrl: row[headers.indexOf('ImageURL')],
    directImageUrl: row[headers.indexOf('DirectImageURL')],
    priority: Number(row[headers.indexOf('Priority')] || 1),
    status: row[headers.indexOf('Status')] || 'Active',
    createdAt: row[headers.indexOf('CreatedAt')],
  };
}

function nextId() {
  const sheet = getImageLibrarySheet();
  ensureHeaders(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().map(Number).filter(Boolean);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function saveAdmissionLead(body) {
  const sheet = getAdmissionLeadsSheet();
  ensureLeadHeaders(sheet);
  const id = body.ID || body.id || `AI-${Date.now()}`;
  const row = [
    id,
    body.Name || body.name || '',
    body.Phone || body.phone || '',
    body.Question || body.question || '',
    body.Language || body.language || '',
    body.Source || body.source || 'AI Admission Assistant',
    body.Status || body.status || 'New',
    body.CreatedAt || body.createdAt || new Date().toISOString(),
  ];
  sheet.appendRow(row);
  return {
    ok: true,
    id,
    name: row[1],
    phone: row[2],
    question: row[3],
    language: row[4],
    source: row[5],
    status: row[6],
    createdAt: row[7],
  };
}

function getImageLibrarySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function getAdmissionLeadsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    applySheetDesign(sheet);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
  HEADERS.forEach((header) => {
    if (!currentHeaders.includes(header)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      currentHeaders.push(header);
    }
  });
  applySheetDesign(sheet);
}

function ensureLeadHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
    applyLeadSheetDesign(sheet);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), LEAD_HEADERS.length)).getValues()[0];
  LEAD_HEADERS.forEach((header) => {
    if (!currentHeaders.includes(header)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      currentHeaders.push(header);
    }
  });
  applyLeadSheetDesign(sheet);
}

function applySheetDesign(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setBackground('#071B5C')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);
  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 360);
  sheet.setColumnWidth(6, 360);
  sheet.setColumnWidth(7, 90);
  sheet.setColumnWidth(8, 110);
  sheet.setColumnWidth(9, 190);

  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, maxRows, HEADERS.length)
    .setBackground('#F8FAFC')
    .setFontColor('#0F172A')
    .setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  sheet.getRange(2, 3, maxRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CATEGORY_OPTIONS, true)
      .setAllowInvalid(false)
      .build()
  );

  sheet.getRange(2, 4, maxRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CAMPUS_OPTIONS, true)
      .setAllowInvalid(true)
      .build()
  );

  sheet.getRange(2, 8, maxRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build()
  );

  sheet.getRange(2, 7, maxRows, 1).setNumberFormat('0');
  sheet.getRange(2, 9, maxRows, 1).setNumberFormat('yyyy-mm-dd hh:mm');

  const statusRange = sheet.getRange(2, 8, maxRows, 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Active')
      .setBackground('#D1FAE5')
      .setFontColor('#065F46')
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Inactive')
      .setBackground('#FEE2E2')
      .setFontColor('#991B1B')
      .setRanges([statusRange])
      .build(),
  ];
  sheet.setConditionalFormatRules(rules);
}

function applyLeadSheetDesign(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, LEAD_HEADERS.length);
  headerRange
    .setBackground('#071B5C')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 420);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 180);
  sheet.setColumnWidth(7, 110);
  sheet.setColumnWidth(8, 190);

  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, maxRows, LEAD_HEADERS.length)
    .setBackground('#F8FAFC')
    .setFontColor('#0F172A')
    .setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sheet.getRange(2, 7, maxRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Contacted', 'Tour Booked', 'Assessment', 'Enrolled', 'Closed'], true)
      .setAllowInvalid(true)
      .build()
  );
  sheet.getRange(2, 8, maxRows, 1).setNumberFormat('yyyy-mm-dd hh:mm');
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

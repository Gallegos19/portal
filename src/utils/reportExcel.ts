import ExcelJS from 'exceljs';
import unboundLogo from '../core/assets/images/unbound-logo.webp';
import kuxtalLogo from '../core/assets/images/logo_kuxtal.png';

interface BuildExcelParams {
  sheetName: string;
  metadata: Record<string, string | number | null | undefined>;
  rows: Array<Record<string, string | number | null | undefined>>;
  fileName: string;
  evidences?: File[];
}

const toPngDataUrl = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('No se pudo convertir logo para Excel:', error);
    return null;
  }
};

const fileToPngDataUrl = async (file: File): Promise<string | null> => {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('No se pudo procesar imagen de evidencia para Excel:', error);
    return null;
  }
};

const applyHeaderStyle = (cell: ExcelJS.Cell, background: string, color = 'FFFFFFFF') => {
  cell.font = { bold: true, color: { argb: color }, size: 12 };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: background } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
};

const toExcelColumns = (rows: Array<Record<string, string | number | null | undefined>>) => {
  const firstRow = rows[0] || { Registro: 'Sin datos' };
  return Object.keys(firstRow);
};

export const buildExcelFile = async ({ sheetName, metadata, rows, fileName, evidences = [] }: BuildExcelParams): Promise<File> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Portal Kuxtal';
  workbook.lastModifiedBy = 'Portal Kuxtal';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.views = [{ state: 'frozen', ySplit: 8 }];
  worksheet.properties.defaultRowHeight = 21;

  worksheet.columns = [
    { key: 'A', width: 22 },
    { key: 'B', width: 20 },
    { key: 'C', width: 20 },
    { key: 'D', width: 20 },
    { key: 'E', width: 20 },
    { key: 'F', width: 20 },
    { key: 'G', width: 20 },
    { key: 'H', width: 20 },
  ];

  worksheet.mergeCells('B1:G1');
  worksheet.getCell('B1').value = 'Portal Kuxtal - Reporte Oficial';
  worksheet.getCell('B1').font = { bold: true, color: { argb: 'FF1E3A8A' }, size: 18 };
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('B2:G2');
  worksheet.getCell('B2').value = `Sección: ${sheetName}`;
  worksheet.getCell('B2').font = { bold: true, color: { argb: 'FF374151' }, size: 11 };
  worksheet.getCell('B2').alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.getRow(1).height = 36;
  worksheet.getRow(2).height = 24;

  const [unboundLogoData, kuxtalLogoData] = await Promise.all([
    toPngDataUrl(unboundLogo),
    toPngDataUrl(kuxtalLogo),
  ]);

  if (unboundLogoData) {
    const logoId = workbook.addImage({ base64: unboundLogoData, extension: 'png' });
    worksheet.addImage(logoId, { tl: { col: 0, row: 0 }, ext: { width: 120, height: 45 } });
  }

  if (kuxtalLogoData) {
    const logoId = workbook.addImage({ base64: kuxtalLogoData, extension: 'png' });
    worksheet.addImage(logoId, { tl: { col: 7, row: 0 }, ext: { width: 72, height: 52 } });
  }

  worksheet.mergeCells('A4:B4');
  worksheet.getCell('A4').value = 'Resumen del reporte';
  applyHeaderStyle(worksheet.getCell('A4'), 'FF1E3A8A');

  let metadataRow = 5;
  Object.entries(metadata).forEach(([key, value]) => {
    const keyCell = worksheet.getCell(`A${metadataRow}`);
    const valueCell = worksheet.getCell(`B${metadataRow}`);
    keyCell.value = key;
    valueCell.value = value ?? '';

    keyCell.font = { bold: true, color: { argb: 'FF374151' }, size: 10 };
    keyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
    valueCell.font = { color: { argb: 'FF111827' }, size: 10 };

    keyCell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    };
    valueCell.border = keyCell.border;
    metadataRow += 1;
  });

  const startRow = metadataRow + 2;
  const safeRows = rows.length > 0 ? rows : [{ Registro: 'Sin registros' }];
  const columns = toExcelColumns(safeRows);

  columns.forEach((column, index) => {
    const cell = worksheet.getCell(startRow, index + 1);
    cell.value = column;
    applyHeaderStyle(cell, 'FF26C6DA', 'FF0F172A');
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'thin', color: { argb: 'FF94A3B8' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
    };
  });

  safeRows.forEach((rowData, rowIndex) => {
    const rowNumber = startRow + 1 + rowIndex;
    columns.forEach((column, columnIndex) => {
      const cell = worksheet.getCell(rowNumber, columnIndex + 1);
      cell.value = rowData[column] ?? '';
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      cell.font = { size: 10, color: { argb: 'FF1F2937' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowIndex % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  columns.forEach((column, columnIndex) => {
    const maxLength = Math.max(
      column.length,
      ...safeRows.map((row) => String(row[column] ?? '').length)
    );
    worksheet.getColumn(columnIndex + 1).width = Math.min(Math.max(maxLength + 4, 14), 42);
  });

  const imageFiles = evidences.filter((file) => file.type.startsWith('image/'));
  const nonImageFiles = evidences.filter((file) => !file.type.startsWith('image/'));

  let evidenceStartRow = startRow + safeRows.length + 2;
  worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
  worksheet.getCell(`A${evidenceStartRow}`).value = 'Evidencias adjuntas';
  applyHeaderStyle(worksheet.getCell(`A${evidenceStartRow}`), 'FF1E3A8A');

  evidenceStartRow += 1;
  worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
  worksheet.getCell(`A${evidenceStartRow}`).value = `Imágenes incluidas en Excel: ${imageFiles.length}`;
  worksheet.getCell(`A${evidenceStartRow}`).font = { bold: true, color: { argb: 'FF374151' }, size: 10 };

  if (nonImageFiles.length > 0) {
    evidenceStartRow += 1;
    worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
    worksheet.getCell(`A${evidenceStartRow}`).value = `Archivos no imagen (no embebibles): ${nonImageFiles.map((file) => file.name).join(' | ')}`;
    worksheet.getCell(`A${evidenceStartRow}`).font = { color: { argb: 'FF6B7280' }, size: 9, italic: true };
  }

  if (imageFiles.length === 0) {
    evidenceStartRow += 2;
    worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
    worksheet.getCell(`A${evidenceStartRow}`).value = 'Sin evidencias de imagen para insertar.';
    worksheet.getCell(`A${evidenceStartRow}`).font = { color: { argb: 'FF6B7280' }, size: 10 };
  } else {
    let blockStartRow = evidenceStartRow + 2;

    for (const [index, file] of imageFiles.entries()) {
      const pngDataUrl = await fileToPngDataUrl(file);
      if (!pngDataUrl) continue;

      worksheet.mergeCells(`A${blockStartRow}:H${blockStartRow}`);
      worksheet.getCell(`A${blockStartRow}`).value = `Evidencia ${index + 1}: ${file.name}`;
      worksheet.getCell(`A${blockStartRow}`).font = { bold: true, color: { argb: 'FF0F172A' }, size: 10 };
      worksheet.getCell(`A${blockStartRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      };

      const imageId = workbook.addImage({ base64: pngDataUrl, extension: 'png' });

      const imageTopRow = blockStartRow + 1;
      const imageHeightPx = 260;
      const imageWidthPx = 720;

      worksheet.addImage(imageId, {
        tl: { col: 0, row: imageTopRow - 1 },
        ext: { width: imageWidthPx, height: imageHeightPx },
      });

      for (let row = imageTopRow; row <= imageTopRow + 12; row += 1) {
        worksheet.getRow(row).height = 24;
      }

      blockStartRow = imageTopRow + 14;
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return new File([blob], fileName, { type: blob.type });
};

export interface BecaExpenseRow {
  fecha: string;
  emisor: string;
  concepto: string;
  montoCompra: string | number;
  observacion?: string;
}

interface BuildBecasExcelParams {
  fileName: string;
  periodo: string;
  nombreBecario: string;
  chid: string;
  subproyecto: string;
  numeroTarjeta: string;
  saldoMesAnterior: string | number;
  depositoBeca: string | number;
  depositoMateriales: string | number;
  comentarios?: string;
  gastos: BecaExpenseRow[];
  evidences?: File[];
}

const applyBoxBorder = (cell: ExcelJS.Cell, color = 'FF9CA3AF') => {
  cell.border = {
    top: { style: 'thin', color: { argb: color } },
    left: { style: 'thin', color: { argb: color } },
    bottom: { style: 'thin', color: { argb: color } },
    right: { style: 'thin', color: { argb: color } },
  };
};

const toDateCellValue = (value: string): Date | string => {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : parsed;
};

const toNumberCellValue = (value: string | number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildBecasExcelFile = async ({
  fileName,
  periodo,
  nombreBecario,
  chid,
  subproyecto,
  numeroTarjeta,
  saldoMesAnterior,
  depositoBeca,
  depositoMateriales,
  comentarios,
  gastos,
  evidences = [],
}: BuildBecasExcelParams): Promise<File> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Portal Kuxtal';
  workbook.lastModifiedBy = 'Portal Kuxtal';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('COMPROBACIÓN DE BECAS Y MATERIA');
  worksheet.views = [{ state: 'frozen', ySplit: 8 }];

  worksheet.columns = [
    { key: 'A', width: 12 },
    { key: 'B', width: 18 },
    { key: 'C', width: 24 },
    { key: 'D', width: 28 },
    { key: 'E', width: 16 },
    { key: 'F', width: 24 },
    { key: 'G', width: 28 },
    { key: 'H', width: 24 },
  ];

  worksheet.mergeCells('A1:G1');
  worksheet.getCell('A1').value = 'COMPROBACIÓN DE BECAS Y MATERIALES/CONTROL DE GASTOS BIMESTRAL';
  worksheet.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF0F172A' } };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
  applyBoxBorder(worksheet.getCell('A1'));
  worksheet.getRow(1).height = 26;

  const merges = [
    'A2:B2', 'C2:D2', 'E2:F2',
    'A3:B3', 'C3:D3', 'E3:F3',
    'A4:B4', 'C4:D4', 'E4:F4',
    'A5:B5', 'C5:D5', 'E5:F5',
    'A6:B6', 'C6:D6', 'E6:F6',
  ];
  merges.forEach((range) => worksheet.mergeCells(range));

  worksheet.getCell('A2').value = 'NOMBRE DEL /LA BECARIO (A)';
  worksheet.getCell('C2').value = nombreBecario || '';
  worksheet.getCell('E2').value = 'RESUMEN';

  worksheet.getCell('A3').value = 'CHID';
  worksheet.getCell('C3').value = chid || '';
  worksheet.getCell('E3').value = 'SALDO DEL MES ANTERIOR';
  worksheet.getCell('F3').value = toNumberCellValue(saldoMesAnterior);

  worksheet.getCell('A4').value = 'SUBPROYECTO';
  worksheet.getCell('C4').value = subproyecto || '';
  worksheet.getCell('E4').value = 'DEPÓSITO DE BECA';
  worksheet.getCell('F4').value = toNumberCellValue(depositoBeca);

  worksheet.getCell('A5').value = 'N° DE TARJETA';
  worksheet.getCell('C5').value = numeroTarjeta || '';
  worksheet.getCell('E5').value = 'DEPÓSITO DE MATERIALES';
  worksheet.getCell('F5').value = toNumberCellValue(depositoMateriales);

  worksheet.getCell('A6').value = 'BIMESTRE Y AÑO';
  worksheet.getCell('C6').value = periodo || '';
  worksheet.getCell('E6').value = 'TOTAL ACUMULADO A COMPROBAR';
  worksheet.getCell('F6').value = { formula: 'SUM(F3:F5)' };

  for (let row = 2; row <= 6; row += 1) {
    ['A', 'C', 'E'].forEach((column) => {
      const labelCell = worksheet.getCell(`${column}${row}`);
      labelCell.font = { bold: true, size: 10, color: { argb: 'FF1F2937' } };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
    });

    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((column) => applyBoxBorder(worksheet.getCell(`${column}${row}`)));
    worksheet.getRow(row).height = 22;
  }

  worksheet.mergeCells('D8:E8');
  worksheet.getCell('A8').value = 'N° DE GASTOS/ COMPRAS';
  worksheet.getCell('B8').value = 'FECHA DE COMPRA';
  worksheet.getCell('C8').value = 'EMISOR';
  worksheet.getCell('D8').value = 'CONCEPTO';
  worksheet.getCell('F8').value = 'MONTO( TOTAL DE LA COMPRA)';
  worksheet.getCell('G8').value = 'OBSERVACIÓN';

  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
    const headerCell = worksheet.getCell(`${column}8`);
    headerCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    applyBoxBorder(headerCell, 'FF334155');
  });
  worksheet.getRow(8).height = 28;

  const fixedRows = 15;
  for (let index = 0; index < fixedRows; index += 1) {
    const rowNumber = 9 + index;
    const rowData = gastos[index];

    worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`);
    worksheet.getCell(`A${rowNumber}`).value = index + 1;
    worksheet.getCell(`B${rowNumber}`).value = rowData ? toDateCellValue(rowData.fecha) : '';
    worksheet.getCell(`C${rowNumber}`).value = rowData?.emisor ?? '';
    worksheet.getCell(`D${rowNumber}`).value = rowData?.concepto ?? '';
    worksheet.getCell(`F${rowNumber}`).value = rowData ? toNumberCellValue(rowData.montoCompra) : 0;
    worksheet.getCell(`G${rowNumber}`).value = rowData?.observacion ?? '';

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
      const cell = worksheet.getCell(`${column}${rowNumber}`);
      cell.font = { size: 10, color: { argb: 'FF111827' } };
      cell.alignment = { vertical: 'middle', horizontal: column === 'F' ? 'right' : 'left', wrapText: true };
      applyBoxBorder(cell, 'FFD1D5DB');
      if (index % 2 !== 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      }
    });

    if (worksheet.getCell(`B${rowNumber}`).value instanceof Date) {
      worksheet.getCell(`B${rowNumber}`).numFmt = 'dd/mm/yyyy';
    }
    worksheet.getCell(`F${rowNumber}`).numFmt = '$#,##0.00';
  }

  worksheet.mergeCells('D24:E24');
  worksheet.getCell('D24').value = 'TOTAL DE GASTOS REALIZADOS';
  worksheet.getCell('F24').value = { formula: 'SUM(F9:F23)' };

  worksheet.mergeCells('D25:E25');
  worksheet.getCell('D25').value = 'NUEVO SALDO POR COMPROBAR';
  worksheet.getCell('F25').value = { formula: 'F4-F24' };

  ['D24', 'D25'].forEach((cellId) => {
    const cell = worksheet.getCell(cellId);
    cell.font = { bold: true, color: { argb: 'FF111827' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  ['F24', 'F25'].forEach((cellId) => {
    const cell = worksheet.getCell(cellId);
    cell.font = { bold: true, color: { argb: 'FF0F172A' } };
    cell.numFmt = '$#,##0.00';
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
  });
  ['D', 'E', 'F'].forEach((column) => {
    applyBoxBorder(worksheet.getCell(`${column}24`));
    applyBoxBorder(worksheet.getCell(`${column}25`));
  });

  worksheet.mergeCells('A26:B26');
  worksheet.getCell('A26').value = 'COMENTARIOS';
  worksheet.getCell('A26').font = { bold: true, color: { argb: 'FF111827' } };
  worksheet.getCell('A26').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
  applyBoxBorder(worksheet.getCell('A26'));
  applyBoxBorder(worksheet.getCell('B26'));

  worksheet.mergeCells('A27:G27');
  worksheet.getCell('A27').value = comentarios || 'Sin comentarios adicionales';
  worksheet.getCell('A27').alignment = { wrapText: true, vertical: 'top' };
  worksheet.getRow(27).height = 48;
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => applyBoxBorder(worksheet.getCell(`${column}27`)));

  worksheet.mergeCells('B29:C29');
  worksheet.mergeCells('F29:G29');
  worksheet.getCell('B29').value = '______________________________';
  worksheet.getCell('F29').value = '______________________________';
  worksheet.getCell('B29').alignment = { horizontal: 'center' };
  worksheet.getCell('F29').alignment = { horizontal: 'center' };

  worksheet.mergeCells('B30:C30');
  worksheet.mergeCells('F30:G30');
  worksheet.getCell('B30').value = 'FIRMA DEL /LA BECARIO (A)';
  worksheet.getCell('F30').value = 'FIRMA DEL /LA PROMOTOR (A) SOCIAL';
  worksheet.getCell('B30').font = { bold: true, size: 9, color: { argb: 'FF374151' } };
  worksheet.getCell('F30').font = { bold: true, size: 9, color: { argb: 'FF374151' } };
  worksheet.getCell('B30').alignment = { horizontal: 'center' };
  worksheet.getCell('F30').alignment = { horizontal: 'center' };

  const imageFiles = evidences.filter((file) => file.type.startsWith('image/'));
  const nonImageFiles = evidences.filter((file) => !file.type.startsWith('image/'));

  let evidenceStartRow = 33;
  worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
  worksheet.getCell(`A${evidenceStartRow}`).value = 'EVIDENCIAS ADJUNTAS';
  worksheet.getCell(`A${evidenceStartRow}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell(`A${evidenceStartRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

  evidenceStartRow += 1;
  worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
  worksheet.getCell(`A${evidenceStartRow}`).value = `Imágenes incluidas en Excel: ${imageFiles.length}`;

  if (nonImageFiles.length > 0) {
    evidenceStartRow += 1;
    worksheet.mergeCells(`A${evidenceStartRow}:H${evidenceStartRow}`);
    worksheet.getCell(`A${evidenceStartRow}`).value = `Archivos no imagen: ${nonImageFiles.map((file) => file.name).join(' | ')}`;
    worksheet.getCell(`A${evidenceStartRow}`).font = { color: { argb: 'FF6B7280' }, size: 9, italic: true };
  }

  if (imageFiles.length > 0) {
    let blockStartRow = evidenceStartRow + 2;
    for (const [index, file] of imageFiles.entries()) {
      const pngDataUrl = await fileToPngDataUrl(file);
      if (!pngDataUrl) continue;

      worksheet.mergeCells(`A${blockStartRow}:H${blockStartRow}`);
      worksheet.getCell(`A${blockStartRow}`).value = `Evidencia ${index + 1}: ${file.name}`;
      worksheet.getCell(`A${blockStartRow}`).font = { bold: true, color: { argb: 'FF0F172A' }, size: 10 };

      const imageId = workbook.addImage({ base64: pngDataUrl, extension: 'png' });
      const imageTopRow = blockStartRow + 1;
      worksheet.addImage(imageId, {
        tl: { col: 0, row: imageTopRow - 1 },
        ext: { width: 720, height: 260 },
      });

      for (let row = imageTopRow; row <= imageTopRow + 12; row += 1) {
        worksheet.getRow(row).height = 24;
      }
      blockStartRow = imageTopRow + 14;
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return new File([blob], fileName, { type: blob.type });
};

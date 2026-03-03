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

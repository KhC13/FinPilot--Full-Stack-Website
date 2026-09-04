const { execFile } = require('child_process');
const path = require('path');

const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
const scriptPath = path.join(__dirname, '../market.py');

function runPython(args = []) {
  return new Promise((resolve, reject) => {
    execFile(
      pythonCommand,
      [scriptPath, ...args],
      { maxBuffer: 1024 * 1024 * 5 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('Yahoo Finance Error:', stderr || error.message);
          reject(new Error(stderr || error.message));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          console.error('Yahoo JSON Parse Error:', stdout);
          reject(parseError);
        }
      }
    );
  });
}

exports.getMarketOverview = async (req, res) => {
  try {
    const data = await runPython(['overview']);
    return res.json({ success: true, source: 'yahoo-finance', data });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message || 'Unable to fetch market data',
    });
  }
};

exports.getStockPrices = async (req, res) => {
  try {
    let symbols = [];

    if (typeof req.query.symbols === 'string') {
      symbols = req.query.symbols
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    symbols = [...new Set(symbols)].slice(0, 30);

    if (!symbols.length) {
      return res.status(400).json({
        success: false,
        error: 'At least one symbol is required',
      });
    }

    const data = await runPython(['prices', ...symbols]);

    return res.json({
      success: true,
      source: 'yahoo-finance',
      data,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message || 'Unable to fetch stock prices',
    });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const symbol = String(req.query.symbol || 'RELIANCE').trim();
    const range = String(req.query.range || '1M').toUpperCase();

    const allowedRanges = new Set(['1D', '1W', '1M', '6M', '1Y']);

    if (!allowedRanges.has(range)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid range. Use 1D, 1W, 1M, 6M or 1Y.',
      });
    }

    const data = await runPython(['history', symbol, range]);

    return res.json({
      success: true,
      source: 'yahoo-finance',
      symbol: symbol.toUpperCase(),
      range,
      data,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message || 'Unable to fetch stock history',
    });
  }
};

# Inclura AI - FastAPI Backend

This is the Python FastAPI backend for the Inclura AI project.

## Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Create the project virtual environment:**
   ```bash
   python3 -m venv venv
   ```
   This creates a local environment in the project folder so you can install Python packages without affecting the system Python.

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```
   On Windows:
   ```bash
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Install PyTorch:**
   ```bash
   pip install torch torchvision torchaudio
   ```

5. **Ignore the virtual environment:**
   Add `venv/` to `.gitignore` so the local environment is not committed to source control.

6. **Verify the install:**
   ```bash
   python -c "import torch; print(torch.__version__)"
   ```

5. **Verify the install:**
   ```bash
   python -c "import torch; print(torch.__version__)"
   ```

## Running the Server

Start the FastAPI development server:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Or use Python directly:
```bash
python app.py
```

The API will be available at: `http://localhost:8000`

### API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

- `GET /` - Welcome message and status
- `GET /health` - Health check endpoint
- `GET /api/v1/info` - API information

## Project Structure

```
inclura-ai/
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── venv/              # Virtual environment (after setup)
└── README.md          # This file
```

## Development

To add new routes, edit `app.py` and the Uvicorn server with `--reload` will automatically restart.

## Virtual Environment Management

To deactivate the virtual environment:
```bash
deactivate
```

To reactivate in a new terminal:
```bash
source venv/bin/activate
```

from datetime import datetime

def current_time():
    """
    Returns the current date and time as a string in the format 'YYYY-MM-DD HH:MM:SS'.
    """
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
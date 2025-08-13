from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re

class CustomPasswordValidator:
    """
    Custom password validator with strong security requirements:
    - Minimum 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    - No common patterns or sequences
    """
    
    def validate(self, password, user=None):
        if len(password) < 12:
            raise ValidationError(
                _('Password must be at least 12 characters long.'),
                code='password_too_short',
            )
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _('Password must contain at least one uppercase letter.'),
                code='password_no_upper',
            )
        
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _('Password must contain at least one lowercase letter.'),
                code='password_no_lower',
            )
        
        if not re.search(r'\d', password):
            raise ValidationError(
                _('Password must contain at least one digit.'),
                code='password_no_digit',
            )
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError(
                _('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).'),
                code='password_no_special',
            )
        
        # Check for common patterns
        if re.search(r'(.)\1{2,}', password):
            raise ValidationError(
                _('Password cannot contain repeated characters (e.g., aaa, 111).'),
                code='password_repeated_chars',
            )
        
        if re.search(r'(123|abc|qwe|asd|zxc)', password.lower()):
            raise ValidationError(
                _('Password cannot contain common sequences (e.g., 123, abc).'),
                code='password_common_sequence',
            )
        
        # Check for keyboard patterns
        keyboard_patterns = [
            'qwerty', 'asdfgh', 'zxcvbn', '123456', '654321',
            'qazwsx', 'edcrfv', 'tgbyhn', 'ujmikl', 'poiuyt'
        ]
        
        for pattern in keyboard_patterns:
            if pattern in password.lower():
                raise ValidationError(
                    _('Password cannot contain keyboard patterns.'),
                    code='password_keyboard_pattern',
                )
    
    def get_help_text(self):
        return _(
            'Your password must contain at least 12 characters, including: '
            'uppercase and lowercase letters, digits, and special characters. '
            'Avoid common patterns and sequences.'
        )

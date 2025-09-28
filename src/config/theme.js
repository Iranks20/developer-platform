export const theme = {
  colors: {
    primary: '#37BBA2',
    primaryLight: '#5BCAB0',
    primaryDark: '#2A9B85',
    
    secondary: '#0F8B3C',
    secondaryLight: '#4CAF50',
    secondaryDark: '#0A5A28',
    
    accent: '#FF6B35',
    accentLight: '#FF8A65',
    accentDark: '#E55722',
    
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    background: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceLight: '#F8F9FA',
    surfaceDark: '#F0F2F5',
    
    textPrimary: '#04304B',
    textSecondary: '#000000',
    textTertiary: '#000000',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputFocus: '#37BBA2',
    inputError: '#F44336',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
  },
  
  typography: {
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

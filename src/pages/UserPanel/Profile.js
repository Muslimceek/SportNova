import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Typography, Avatar, Button, TextField, Modal, Paper, Divider, Stack,
  styled, keyframes, alpha
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebaseConfig';

const db = getFirestore();

// Modern keyframe animations
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseEffect = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 120, 212, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(0, 120, 212, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 120, 212, 0); }
`;

const floatEffect = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components for premium UI
const ProfileContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 700,
  margin: '20px auto', // Reduced margin for mobile
  padding: theme.spacing(3), // Reduced padding for mobile
  borderRadius: 16,
  background: '#ffffff',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-5px)',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '10px',
    padding: theme.spacing(2),
    borderRadius: 12,
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: '4px solid #fff',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 80,
    height: 80,
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #0062E6, #33AEFF, #0062E6)',
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 5s ease infinite`,
  color: 'white',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: 12,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0, 98, 230, 0.3)',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 98, 230, 0.5)',
    transform: 'translateY(-3px)',
    animation: `${pulseEffect} 1.5s infinite`,
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 16px',
    fontSize: '0.9rem',
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  padding: '10px 20px',
  borderRadius: 10,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.15),
    animation: `${floatEffect} 2s ease infinite`,
  }
}));

const AnimatedSection = styled(Box)(({ theme }) => ({
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40px',
    height: '3px',
    background: 'linear-gradient(90deg, #0062E6, #33AEFF)',
    borderRadius: '10px',
  }
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
  fontWeight: 500,
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
}));

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(4),
  '&:focus': {
    outline: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    padding: theme.spacing(2),
    maxHeight: '90vh',
    overflowY: 'auto',
  }
}));

const Profile = () => {
  const { currentUser } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (currentUser) {
      const data = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Не задано',
        photoURL: currentUser.photoURL,
        phoneNumber: currentUser.phoneNumber || 'Не указан',
        role: 'user',
        emailVerified: currentUser.emailVerified,
      };
      setUserData(data);
      setValue('displayName', currentUser.displayName || '');
      setValue('phoneNumber', currentUser.phoneNumber || '');
    }
  }, [currentUser, setValue]);

  const handleSaveChanges = async (data) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: avatarPreview || currentUser.photoURL,
      });
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        phoneNumber: data.phoneNumber
      });
      setEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordReset = async () => {
    await sendPasswordResetEmail(auth, currentUser.email);
    alert('Ссылка для смены пароля отправлена на email.');
  };

  const handleEmailVerification = async () => {
    await sendEmailVerification(auth.currentUser);
    alert('Письмо с подтверждением email отправлено!');
  };

  if (!userData) return null;

  return (
    <ProfileContainer elevation={0}>
      <Stack direction="column" spacing={{ xs: 2, md: 4 }}>
        <SectionTitle variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Профиль</SectionTitle>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 2, sm: 3 }} 
          alignItems={{ xs: "center", sm: "flex-start" }}
        >
          <ProfileAvatar
            src={avatarPreview || userData.photoURL}
            alt={userData.displayName}
          />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              {userData.displayName}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 0.5,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                flexWrap: 'wrap',
                gap: 0.5
              }}
            >
              {userData.email}
              {userData.emailVerified && (
                <Box 
                  component="span" 
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'white', 
                    fontSize: '0.7rem', 
                    py: 0.3, 
                    px: 1, 
                    borderRadius: 5,
                    fontWeight: 'bold',
                    ml: { xs: 0, sm: 1 }
                  }}
                >
                  Подтвержден
                </Box>
              )}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: alpha('#000', 0.08) }} />

        <Stack direction="column" spacing={{ xs: 2, md: 3 }}>
          <AnimatedSection>
            <InfoLabel>ID пользователя</InfoLabel>
            <InfoValue>{userData.uid}</InfoValue>
          </AnimatedSection>
          
          <AnimatedSection>
            <InfoLabel>Номер телефона</InfoLabel>
            <InfoValue>{userData.phoneNumber}</InfoValue>
          </AnimatedSection>
          
          <AnimatedSection>
            <InfoLabel>Роль в системе</InfoLabel>
            <InfoValue sx={{ 
              display: 'inline-block',
              bgcolor: alpha('#0062E6', 0.1),
              color: '#0062E6',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}>
              {userData.role}
            </InfoValue>
          </AnimatedSection>
        </Stack>

        <GradientButton
          size="large"
          fullWidth
          onClick={() => setEditModalOpen(true)}
          sx={{ mt: { xs: 1, md: 2 } }}
        >
          Редактировать профиль
        </GradientButton>

        <Divider sx={{ borderColor: alpha('#000', 0.08) }} />

        <Box>
          <SectionTitle variant="h6">Безопасность</SectionTitle>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }} 
            mt={{ xs: 1, md: 2 }}
          >
            <SecondaryButton fullWidth onClick={handlePasswordReset}>
              Сменить пароль
            </SecondaryButton>
            {!userData.emailVerified && (
              <SecondaryButton fullWidth onClick={handleEmailVerification}>
                Подтвердить email
              </SecondaryButton>
            )}
            <SecondaryButton 
              fullWidth 
              onClick={() => signOut(auth)}
              sx={{ 
                borderColor: alpha('#f44336', 0.3),
                color: '#f44336',
                background: alpha('#f44336', 0.05),
                '&:hover': {
                  background: alpha('#f44336', 0.1),
                }
              }}
            >
              Выйти
            </SecondaryButton>
          </Stack>
        </Box>
      </Stack>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalContainer
          component="form"
          onSubmit={handleSubmit(handleSaveChanges)}
        >
          <Stack spacing={{ xs: 2, md: 3 }}>
            <SectionTitle variant="h6">Редактирование профиля</SectionTitle>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={{ xs: 2, sm: 3 }} 
              alignItems="center"
            >
              <ProfileAvatar 
                src={avatarPreview || userData.photoURL} 
                sx={{ width: { xs: 70, sm: 80 }, height: { xs: 70, sm: 80 } }} 
              />
              <Button 
                component="label" 
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: alpha('#0062E6', 0.5),
                  color: '#0062E6',
                  '&:hover': {
                    borderColor: '#0062E6',
                    background: alpha('#0062E6', 0.05),
                  },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Загрузить фото
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Stack>

            <TextField
              label="Имя"
              fullWidth
              variant="outlined"
              {...register('displayName', { minLength: 2 })}
              error={!!errors.displayName}
              helperText={errors.displayName && 'Минимум 2 символа'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#0062E6', 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0062E6',
                  }
                }
              }}
            />

            <TextField
              label="Телефон"
              fullWidth
              variant="outlined"
              {...register('phoneNumber', {
                pattern: /^\+7\d{10}$/
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber && 'Формат: +7XXXXXXXXXX'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#0062E6', 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0062E6',
                  }
                }
              }}
            />

            <GradientButton type="submit" fullWidth>
              Сохранить изменения
            </GradientButton>
          </Stack>
        </ModalContainer>
      </Modal>
    </ProfileContainer>
  );
};

export default Profile;

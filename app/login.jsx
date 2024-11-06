import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import BackButton from '../components/BackButton';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', "Please fill all the fields.");
            return;
        }
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        console.log('error: ', error);
        if (error) {
            Alert.alert('Login', error.message);
        }
    };

    const onForgotPassword = async () => {
        if (!emailRef.current || emailRef.current.trim() === '') {
            Alert.alert('Forgot Password', 'Please enter your email.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(emailRef.current.trim(), {
            redirectTo: 'http://10.0.2.2:3000/reset-password'
        });
        setLoading(false);
        if (error) {
            Alert.alert('Forgot Password', error.message);
        } else {
            setIsOtpSent(true, Alert.alert('Forgot Password', 'Check your email for the password reset link.'));
        }
    };

    const onVerifyOtp = async () => {
        const { error } = await supabase.auth.verifyOtp({
            email: emailRef.current.trim(),
            token: otp,
            type: 'recovery'
        });
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'OTP verified. You can reset your password.');
            router.push('resetPassword');
        }
    };

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />
                <View>
                    <Text style={styles.welcomeText}>Hi,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Please login to continue.
                    </Text>
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder='Enter your email'
                        onChangeText={value => emailRef.current = value}
                    />
                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder='Enter your password'
                        secureTextEntry
                        onChangeText={value => passwordRef.current = value}
                    />
                    {isOtpSent && (
                        <Input
                            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                            placeholder='Enter OTP'
                            onChangeText={value => setOtp(value)}
                        />
                    )}
                    <Pressable onPress={onForgotPassword}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </Pressable>
                    <Button
                        title={isOtpSent ? 'Verify OTP' : 'Login'}
                        loading={loading}
                        onPress={isOtpSent ? onVerifyOtp : onSubmit}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Pressable onPress={() => router.push('signUp')}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Sign up!</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
});

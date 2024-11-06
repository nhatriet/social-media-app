import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';

const ResetPassword = () => {
    const router = useRouter();
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onResetPassword = async () => {
        if (!newPasswordRef.current || newPasswordRef.current.trim() === '') {
            Alert.alert('Error', 'Please enter your new password.');
            return;
        }
        if (newPasswordRef.current !== confirmPasswordRef.current) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser ({ password: newPasswordRef.current.trim() });
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Your password has been reset successfully.');
            router.push('login'); 
        }
    };

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Input
                        placeholder='Enter your new password'
                        secureTextEntry
                        onChangeText={value => newPasswordRef.current = value}
                    />
                    <Input
                        placeholder='Confirm your new password'
                        secureTextEntry
                        onChangeText={value => confirmPasswordRef.current = value}
                    />
                    <Button
                        title='Reset Password'
                        loading={loading}
                        onPress={onResetPassword}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: wp(5),
    },
    title: {
        fontSize: hp(3),
        fontWeight: theme.fonts.bold,
        marginBottom: 20,
        textAlign: 'center',
        color: theme.colors.text,
    },
    form: {
        gap: 25
    },
});
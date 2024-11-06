import { View, Alert, Linking } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = async (url) => {
            const route = url.replace(/.*?:\/\//g, ''); // Xóa phần scheme
            const [path, queryString] = route.split('?');
            const params = new URLSearchParams(queryString);

            // Kiểm tra nếu path là 'reset-password'
            if (path === 'reset-password') {
                const token = params.get('token'); // Lấy token từ query params
                Alert.prompt(
                    'Reset Password',
                    'Enter your new password:',
                    async (newPassword) => {
                        if (newPassword) {
                            const { data, error } = await supabase.auth.updateUser({ password: newPassword });
                            if (error) {
                                Alert.alert('Error', error.message);
                            } else {
                                Alert.alert('Success', 'Password updated successfully!');
                                router.push('/login'); // Redirect to login after successful update
                            }
                        } else {
                            Alert.alert('Error', 'New password cannot be empty.');
                        }
                    }
                );
            }
        };

        // Kiểm tra nếu app được mở bằng liên kết deep link
        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    handleDeepLink(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* Render loading or any other UI component */}
        </View>
    );
};

export default Index;

import React from 'react';
import {
    Text,
    View, StyleSheet,
    Image, TextInput,
    TouchableOpacity,
} from 'react-native';

export default function SignIn() {
    return (
        <View style={styles.container}>
            <Image
                resizeMode="stretch"
                style={styles.logo}
                source={require('../../assets/RestOn_branco.png')}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Digite seu Email'
                    style={styles.input}
                    placeholderTextColor='#f0f0f0'
                />
                <TextInput
                    placeholder='Digite sua senha'
                    style={styles.input}
                    placeholderTextColor='#f0f0f0'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e',
    },
    logo: {
        width: 250,
        height: 90,
        marginBottom: 18,
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 14,
    },
    input: {
        width: '95%',
        height: 40,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#fff',
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101026',
    }
})
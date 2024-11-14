import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Document as DocType } from '@/stores/documentStore';
import DOMPurify from 'dompurify';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    metadata: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
    },
    content: {
        fontSize: 12,
        lineHeight: 1.5,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 10,
    },
    tag: {
        fontSize: 10,
        backgroundColor: '#f0f0f0',
        padding: '4 8',
        borderRadius: 4,
    }
});

interface DocumentPDFProps {
    document: DocType;
}

const DocumentPDF = ({ document }: DocumentPDFProps) => {
    // Convert JSON content to plain text
    const contentString = document.content.content
        ?.map(node => node.content?.map(n => n.text).join('') || '')
        .join('\n') || '';
    const cleanContent = DOMPurify.sanitize(contentString, { ALLOWED_TAGS: [] });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{document.title}</Text>
                    <Text style={styles.metadata}>
                        Created: {new Date(document.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.metadata}>
                        Last Updated: {new Date(document.updatedAt).toLocaleDateString()}
                    </Text>
                    <View style={styles.tags}>
                        {document.tags.map((tag, index) => (
                            <Text key={index} style={styles.tag}>
                                {tag}
                            </Text>
                        ))}
                    </View>
                </View>
                <View style={styles.content}>
                    <Text>{cleanContent}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default DocumentPDF; 
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { IDocument } from '@/types/document';

// Register fonts
Font.register({
    family: 'Courier',
    src: 'https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELaw9pWt_-.ttf'
});

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
    },
    paragraph: {
        marginBottom: 10,
    },
    heading1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    heading3: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    code: {
        fontFamily: 'Courier',
        backgroundColor: '#f5f5f5',
        padding: 8,
        marginVertical: 8,
    },
    image: {
        objectFit: 'contain',
        maxWidth: '100%',
        marginVertical: 8,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 10,
    },
    bullet: {
        marginRight: 8,
    },
    textContent: {
        flex: 1,
    }
});

interface DocumentPDFProps {
    document: IDocument;
}

const DocumentPDF = ({ document }: DocumentPDFProps) => {
    const renderContent = (content: any): any => {
        if (!content) return null;

        if (Array.isArray(content)) {
            return content.map((node, index) => renderNode(node, index));
        }

        return renderNode(content);
    };

    const renderText = (textNode: any) => {
        if (!textNode) return null;

        let text = textNode.text || '';

        // Handle marks (bold, italic, etc.)
        if (textNode.marks) {
            textNode.marks.forEach((mark: any) => {
                switch (mark.type) {
                    case 'bold':
                        text = <Text style={{ fontWeight: 'bold' }}>{text}</Text>;
                        break;
                    case 'italic':
                        text = <Text style={{ fontStyle: 'italic' }}>{text}</Text>;
                        break;
                    case 'underline':
                        text = <Text style={{ textDecoration: 'underline' }}>{text}</Text>;
                        break;
                    // Add more mark types as needed
                }
            });
        }

        return text;
    };

    const renderNode = (node: any, index?: number) => {
        if (!node) return null;

        try {
            switch (node.type) {
                case 'doc':
                    return renderContent(node.content);

                case 'paragraph':
                    return (
                        <View key={index} style={styles.paragraph}>
                            <Text>{renderContent(node.content)}</Text>
                        </View>
                    );

                case 'heading':
                    const headingStyle = styles[`heading${node.attrs?.level || 1}` as keyof typeof styles];
                    return (
                        <Text key={index} style={headingStyle}>
                            {renderContent(node.content)}
                        </Text>
                    );

                case 'codeBlock':
                    return (
                        <View key={index} style={styles.code}>
                            <Text>{node.content?.map((n: any) => n.text).join('\n')}</Text>
                        </View>
                    );

                case 'image':
                    try {
                        return (
                            <Image
                                key={index}
                                style={styles.image}
                                src={node.attrs?.src}
                            />
                        );
                    } catch (error) {
                        console.error('Error rendering image:', error);
                        return null;
                    }

                case 'bulletList':
                    return node.content?.map((item: any, i: number) => (
                        <View key={`${index}-${i}`} style={styles.listItem}>
                            <Text style={styles.bullet}>•</Text>
                            <View style={styles.textContent}>
                                {renderContent(item.content)}
                            </View>
                        </View>
                    ));

                case 'text':
                    return renderText(node);

                default:
                    if (node.content) {
                        return renderContent(node.content);
                    }
                    return null;
            }
        } catch (error) {
            console.error('Error rendering node:', error, node);
            return null;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{document.title}</Text>
                    <Text style={styles.metadata}>{document.createdAt.toLocaleString()}</Text>
                </View>
                <View style={styles.content}>
                    {renderContent(document.content)}
                </View>
            </Page>
        </Document>
    );
};

export default DocumentPDF; 
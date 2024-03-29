package com.wisemapping.test.freemind;

import com.wisemapping.exporter.ExportException;
import com.wisemapping.exporter.FreemindExporter;
import com.wisemapping.importer.ImporterException;

import com.wisemapping.model.Mindmap;
import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.*;

@Test
public class ExportTest {
    private static final String DATA_DIR_PATH = "src/test/resources/data/wisemaps/";
    private static final String UTF_8 = "UTF-8";

    @Test(dataProvider = "Data-Provider-Function")
    public void exportImportExportTest(@NotNull final File wisemap, @NotNull final File recFile) throws ImporterException, IOException, ExportException {


        final Mindmap mindmap = load(wisemap);

        final FreemindExporter freemindExporter = new FreemindExporter();
        if (recFile.exists()) {
            // Compare rec and file ...
            final String recContent = FileUtils.readFileToString(recFile, "UTF-8");

            // Export mile content ...
            final ByteArrayOutputStream bos = new ByteArrayOutputStream();
            freemindExporter.export(mindmap, bos);
            final String exportContent = new String(bos.toByteArray(), UTF_8);

            Assert.assertEquals(recContent, exportContent);

        } else {
            final OutputStream fos = new FileOutputStream(recFile);
            freemindExporter.export(mindmap, fos);
            fos.close();
        }
    }

    private Mindmap load(@NotNull File wisemap) throws IOException {
        final byte[] recContent = FileUtils.readFileToByteArray(wisemap);
        final Mindmap result = new Mindmap();
        result.setXml(recContent);
        return result;
    }

    //This function will provide the parameter data
    @DataProvider(name = "Data-Provider-Function")
    public Object[][] parameterIntTestProvider() {

        final File dataDir = new File(DATA_DIR_PATH);
        final File[] freeMindFiles = dataDir.listFiles(new FilenameFilter() {

            public boolean accept(File dir, String name) {
                return name.endsWith(".wxml");
            }
        });

        final Object[][] result = new Object[freeMindFiles.length][2];
        for (int i = 0; i < freeMindFiles.length; i++) {
            File freeMindFile = freeMindFiles[i];
            final String name = freeMindFile.getName();
            result[i] = new Object[]{freeMindFile, new File(DATA_DIR_PATH, name.substring(0, name.lastIndexOf(".")) + ".mmr")};
        }

        return result;
    }


}
